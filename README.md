# cisco-wlc-cronicle
Cronicle plugin for enabling/disabling WLANs on a Cisco AireOS Controller.

## Usage
Install the dependency of the script: `node-ssh`. To do this, run `npm install node-ssh` in your Cronicle directory, which is `/opt/cronicle` by default.

Supply the following parameters when importing the plugin into Cronicle:

| **Param ID**    | **Control Type** |
|-----------------|------------------|
| `controller_ip` | Text Field       |
| `username`      | Text Field       |
| `password`      | Text Field       |
| `wlan_id`       | Text Field       |
| `enable`        | Checkbox         |

### Explanation
The `controller_ip` field indicates the IP address of the management interface on the WLC.

The `username` & `password` fields are used for SSH access. 

The `wlan_id` field indicates which WLAN to toggle, and the `enable` field indicates the desired state of said WLAN.
