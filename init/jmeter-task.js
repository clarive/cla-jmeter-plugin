var reg = require('cla/reg');

reg.register('service.task.jmeter', {
    name: _('Run JMeter Script'),
    icon: '/plugin/cla-jmeter-plugin/icon/logo-jmeter.svg',
    form: '/plugin/cla-jmeter-plugin/form/jmeter-task-form.js',
    rulebook: {
        moniker: 'jmeter_script',
        description: _('Launch Jmeter scripts'),
        required: [ 'server'],
        allow: ['server', 'script_path', 'remote_path', 'remote_user', 'command_parameters', 'errors'],
        mapper: {
            'script_path':'scriptPath',
            'remote_path':'remotePath',
            'remote_user':'remoteUser',
            'command_parameters':'commandParameters'
        },
        examples: [{
            jmeter_script: {
                server: 'jmeter_server',
                script_path: '/project/myScript.jmx',
                remote_path: '/tmp/scripts/',
                command_parameters: ['-v', '-d']
            }
        }]
    },
    handler: function(ctx, params) {

        var regRemote = require('cla/reg');
        var fs = require('cla/fs');
        var path = require('cla/path');
        var log = require('cla/log');
        var digest = require("cla/digest");
        var proc = require("cla/process");

        var CLARIVE_BASE = proc.env('CLARIVE_BASE');
        var errorsType = params.errors || 'fail';
        var command = '';
        var output = '';

        var scriptPath = params.scriptPath || '/tmp/script.jmx';
        var scriptName = path.basename(scriptPath);

        var executionCode = digest.md5(ctx.stash('job_name'));

        var remotePath = path.join(params.remotePath || '/tmp', executionCode);
        var resultsPath  = path.join(remotePath, 'results');
        var logPath  = path.join(remotePath, 'jmeter.log');

        var buildJmeterCommand = function(params) {
            var command = 'jmeter -n';


            var remoteScript = path.join(remotePath, scriptName);

            var csvPath  = path.join(remotePath, (params.csvPath || 'script.csv'));

            var commandParameters = params.commandParameters;

            command += ' -t "' + remoteScript + '"';
            command += ' -l "' + csvPath + '"';
            command += ' -j "' + logPath + '"';
            command += ' -e -o "' + resultsPath + '"';

            command += ' ' + commandParameters.join(" ");

            return command;
        }

        log.info(_("Starting JMeter execution.") + "  Script " + scriptName);

        command = buildJmeterCommand(params);

        regRemote.launch('service.scripting.remote', {
            name: 'Create Remote Path',
            config: {
                errors: errorsType,
                server: params.server,
                path: 'mkdir -p ' + resultsPath
            }
        });

       
        regRemote.launch('service.scripting.remote', {
            name: 'Create Remote Path',
            config: {
                errors: errorsType,
                server: params.server,
                path: 'rm -rf ' + resultsPath + '/*'
            }
        });

        regRemote.launch('service.fileman.ship', {
            name: 'Send JMeter Sctipt',
            config: {
                server: params.server,
                user: params.remoteUser,
                recursive: "0",
                local_mode: "local_files",
                local_path: scriptPath,
                exist_mode_local: "skip",
                rel_path: "file_only",
                remote_path: remotePath,
                exist_mode: "reship",
                backup_mode: "none",
                rollback_mode: "none",
                track_mode: "none",
                audit_tracked: "none",
                chown: "",
                chmod: "",
                max_transfer_chunk_size: "",
                copy_attrs: "0"
            }
        });

        log.info("Script " + scriptName + _(" sent to JMeter server"));

        log.info(_("Executing Script ") + scriptName + ".  " + _("Please, be patient"));

        var scriptOutput = regRemote.launch('service.scripting.remote', {
            name: 'Run JMeter Script',
            config: {
                errors: errorsType,
                server: params.server,
                path: command,
                output_error: params.output_error,
                output_warn: params.output_warn,
                output_capture: params.output_capture,
                output_ok: params.output_ok,
                meta: params.meta,
                rc_ok: params.rcOk,
                rc_error: params.rcError,
                rc_warn: params.rcWarn
            }
        });

        log.info("Script " + scriptName + _(" executed"), scriptOutput.output);

        regRemote.launch('service.fileman.retrieve', {
            name: 'Retrieve JMeter results',
            config: {
                server: params.server,
                remote_path: resultsPath,
                local_path: path.join(CLARIVE_BASE,"plugins","cla-jmeter-plugin","public","jmeter_results",executionCode)
            },
        });

        log.info('<a target="_blank" href="/plugin/cla-jmeter-plugin/jmeter_results/' + executionCode + '/index.html">'+ _("Click here to see the JMeter results") +'</a>' );
        log.info("Script " + scriptName + _(" executed"), scriptOutput.output);

        var logOutput = regRemote.launch('service.scripting.remote', {
            name: 'Run JMeter Script',
            config: {
                errors: errorsType,
                server: params.server,
                path: 'cat "' + logPath + '"',
                output_error: params.output_error,
                output_warn: params.output_warn,
                output_capture: params.output_capture,
                output_ok: params.output_ok,
                meta: params.meta,
                rc_ok: params.rcOk,
                rc_error: params.rcError,
                rc_warn: params.rcWarn
            }
        });

        log.debug("Script " + scriptName + _(" executed.") + _("  Complete log"), logOutput.output);

        return scriptOutput;
    }
});
