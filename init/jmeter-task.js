var reg = require('cla/reg');

reg.register('service.task.jmeter', {
    name: 'Run JMeter Script',
    icon: 'plugin/cla-jmeter-plugin/icon/logo-jmeter.svg',
    form: '/plugin/cla-jmeter-plugin/form/jmeter-task-form.js',

    handler: function(ctx, params) {

        var regRemote = require('cla/reg');
        var fs = require('cla/fs');
        var path = require('cla/path');
        var log = require('cla/log');
        var digest = require("cla/digest");

        var errorsType = params.errors || 'fail';
        var command = '';
        var output = '';

        var scriptPath = params.scriptPath || '/tmp/script.jmx';
        var remotePath = path.join(params.remotePath,digest.md5()) || '/tmp';
        var resultsPath  = path.join(remotePath, 'results');

        var buildJmeterCommand = function(params) {
            var command = 'jmeter -n';

            var scriptName = path.basename(scriptPath);

            var remoteScript = path.join(remotePath, scriptName);

            var csvPath  = path.join(remotePath, (params.csvPath || 'script.csv'));

            var commandParameters = params.commandParameters || '';

            command += ' -t "' + remoteScript + '"';
            command += ' -l "' + csvPath + '"';
            command += ' -e -o "' + resultsPath + '"';

            command += ' ' + commandParameters;

            return command;
        }

        command = buildJmeterCommand(params);

        regRemote.launch('service.scripting.remote', {
            name: 'Create Remote Path',
            config: {
                errors: errorsType,
                server: params.server,
                path: 'mkdir -p ' + resultsPath
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

        output = regRemote.launch('service.scripting.remote', {
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

        return output;
    }
});
