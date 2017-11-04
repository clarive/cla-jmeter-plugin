# JMeter Plugin

<img src="https://cdn.rawgit.com/clarive/cla-jmeter-plugin/master/public/icon/logo-jmeter.svg?sanitize=true" alt="JMeter Plugin" title="JMeter Plugin" width="120" height="120">

Execute a JMeter script. It will run a JMeter script you specify and return the results CSV as well as a link to the HTML report generated.

## Requirements

This plugin requires JMeter to be installed in the instance to work properly.

To install Docker check the JMeter project website [here](http://jmeter.apache.org/) and follow the instructions.

## Installing

To install the plugin place the cla-jmeter-plugin folder inside `$CLARIVE_BASE/plugins`
directory in Clarive's instance.

## Run JMeter script

The parameters available are:

- **Server (variable name: server)** - Server that holds the remote file, server to connect to.
- **Script Name (script_path)** - Path of the jmx script to execute.
- **Remote Server Path (remote_path)** - Remote path where the script will be sent.
- **Remote User (remote_user)** - User for the connection to the server.
- **Command Parameters (command_parameters)** - This is optional.  Add any parameter you need for the JMeter command execution.

**Only Clarive EE**

- **Errors and output** - These two fields are related to manage control errors. Options are:
   - **Fail and output error** - Search for configurated error pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Warn and output warn** - Search for configurated warning pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Custom** - In case combo box errors is set to custom a new form is showed to define the behavior with these fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in monitor.
   - **Warn** - Range of return code values to warn the user. A warn message will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in monitor.

## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Op Name: **Run JMeter script**

Example:

```yaml
      Server: generic_server
      Script Name: /tmp/myScript.jmx
      Command Parameters:
      Error: fail
      Output:
            Error:
            Warn:
            Ok: .*Err:\t0
``` 

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

```yaml
rule: JMeter demo
do:
   - jmeter_script:
      server: 'generic_server'               # Required. Use the Resource MID
      script_path: '/project/myScript.jmx'   # Required
      remote_path: '/tmp/scripts/'           # Required
      command_parameters: ['-v', '-d']       
```

##### Outputs

###### Success

The plugin will return the console output.

###### Possible configuration failures

**Upload failed**

The service will return the output from the server console.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "jmeter_script": "server"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `Server` not available for op "jmeter_script"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.