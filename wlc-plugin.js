#!/usr/bin/env node

// Cisco WLC Wlan Admin state toggle
// Copyright (c) 2024 Tamas Simon

// Dependencies to be installed: node-ssh
// npm install node-ssh

// config wlan <enable|disable> <wlan id>
// Params: 
//   controller_ip: string
//   username: string
//   password: string
//   enable: boolean
//   wlan_id: string

var JSONStream = require('pixl-json-stream');
const {NodeSSH} = require('node-ssh');

const WLAN_ID_MIN = 1;
const WLAN_ID_MAX = 512;

const IPV4REGEX = new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function streamToString (stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}

// setup stdin / stdout streams 
process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');

var stream = new JSONStream( process.stdin, process.stdout );
stream.on('json', async function(job) {
	// got job from parent 
	var params = job.params;
	
	// Check if supplied controller_ip is a correct IPv4 address
	if (!IPV4REGEX.test(params.controller_ip)) {
		stream.write({ complete: 1, code: 1, description: "Supplied Controller IP is not an IPv4 address. Got: '" + (params.controller_ip) + "'" });
		return;
	}
	var controller_ip = params.controller_ip;
	
	// Check if wlan_id is Number
	if (isNaN(params.wlan_id)) {
		stream.write({ complete: 1, code: 1, description: "Supplied WLAN ID is not a number. Got: '" + (params.wlan_id) + "'" });
		return;
	}
	
	// Check if wlan_id is between 1-512
	var wlan_id = parseInt(params.wlan_id);
	if (wlan_id < WLAN_ID_MIN || wlan_id > WLAN_ID_MAX) {
		stream.write({ complete: 1, code: 1, description: "Supplied WLAN ID is not within the specified range ( " + WLAN_ID_MIN + " - " + WLAN_ID_MAX + " ). Got: " + (wlan_id) });
		return;
	}
	
	const ssh = new NodeSSH();
	
	await ssh.connect({
		host: controller_ip,
		username: params.username,
		port: 22,
		password: params.password,
	});
	
	// Check if connection is successful
	if (!ssh.isConnected()) {
		stream.write({ complete: 1, code: 1, description: "SSH Connection timed out." });
		return;
	}
	
	// Execute command
	var command = "config wlan " + (params.enable ? "enable" : "disable") + " " + wlan_id;
	console.log("Executing: '" + command + "'\n");
	
	var response;
	
	try {
		await ssh.withShell(async (connection) => {
			await sleep(500);
			// Send command
			connection.write(command + '\n');
			// Collect response
			response = streamToString(connection.stdout);
			await sleep(500);
		});
	} catch (error) {
		stream.write({ complete: 1, code: 1, description: "Error executing the command. Reason: " + error });
		ssh.dispose();
		return;
	}
	
	// End SSH connection
	ssh.dispose();
	
	const result = await response;
	console.log(result);
	
	// Send success message
	if (result.includes("Request failed - already in the requested state.")) {
		stream.write({ complete: 1, code: 0, description: "Command executed successfully, but no change."});
	} else {
		stream.write({ complete: 1, code: 0, description: "Command executed successfully."});
	}
} ); // stream
