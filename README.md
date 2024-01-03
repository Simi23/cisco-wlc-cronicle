[![published](https://static.production.devnetcloud.com/codeexchange/assets/images/devnet-published.svg)](https://developer.cisco.com/codeexchange/github/repo/Simi23/cisco-wlc-cronicle)
# cisco-wlc-cronicle
Cronicle plugin for enabling/disabling WLANs on a Cisco AireOS Controller.

## Installation
To run this plugin, you need Cronicle. See [their page](https://github.com/jhuckaby/Cronicle/blob/master/docs/Setup.md) for setup instructions.

After installing Cronicle, you need to import the plugin file (`wlc-plugin.js`) into the bin directory of the Cronicle install.

```bash
cp wlc-plugin.js /opt/cronicle/bin/
```

The file also needs the `node-ssh` npm packet as a dependency. Make sure to install it.

```bash
cd /opt/cronicle
npm install node-ssh
```

Log in to Cronicle. If using a fresh install, username/password is admin/admin.  
Navigate to the admin page and click on `Plugins > Add New Plugin`.

Provide the following values:

Executable: `bin/wlc-plugin.js` // Note there is no '/' before bin!  

Parameters:
| **Param ID**    | **Control Type** |
|-----------------|------------------|
| `controller_ip` | Text Field       |
| `username`      | Text Field       |
| `password`      | Text Field       |
| `wlan_id`       | Text Field       |
| `enable`        | Checkbox         |

It should look like this:

![Képernyőkép 2024-01-03 120505](https://github.com/Simi23/cisco-wlc-cronicle/assets/44925919/098347b3-4153-4235-8088-8438746e5d28)

### Explanation
The `controller_ip` field indicates the IP address of the management interface on the WLC.

The `username` & `password` fields are used for SSH access. 

The `wlan_id` field indicates which WLAN to toggle, and the `enable` field indicates the desired state of said WLAN.

## Usage
Navigate to Schedule page and click on `Add Event`.

Select the plugin and provide the needed values.

Set all the other parameters to suit your needs.

For example, this setup turns on WLAN ID 5 at 8 AM every day:
![Képernyőkép 2024-01-03 120957](https://github.com/Simi23/cisco-wlc-cronicle/assets/44925919/04d6d268-91e9-43cc-a60c-cf0790a3d61f)
