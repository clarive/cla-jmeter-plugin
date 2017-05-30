# JMeter Plugin

Execute a JMeter script. It will run a JMeter script you specify and return the results CSV as well as a link to the HTML report generated.

## Requirements

This plugin requires JMeter to be installed in the instance to work properly.

To install Docker check the JMeter project website [here](http://jmeter.apache.org/) and follow the instructions.

## Installing

To install the plugin place the cla-jmeter-plugin folder inside `CLARIVE_BASE/plugins`
directory in Clarive's instance.

## How to use

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service.

Form to configure has the following fields:

- **Server** - Server that holds the remote file, server to connect to.
- **Script Name** - Path of the jmx script to execute.
- **Command Parameters** - This is optional.  Add any parameter you need for the jmeter command execution.
- **Errors and output** - These two fields are related to manage control errors. Options are:
   - **Fail and output error** - Search for configurated error pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Warn and output warn** - Search for configurated warning pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Custom** - In case combo box errors is set to custom a new form is showed to define the behavior with these fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in monitor.
   - **Warn** - Range of return code values to warn the user. A warn message will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in monitor.

Example:
      Server: generic_server
      Script Name: /tmp/myScript.jmx
      Command Parameters:
      Error: fail
      Output:
            Error:
            Warn:
            Ok: .*Err:\t0
            Capture:



