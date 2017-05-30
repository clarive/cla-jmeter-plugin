(function(params) {
    Cla.help_push({
        title: _('Jmeter Script'),
        path: 'rules/palette/generic/jmeter-task'
    });
    var data = params.data || {};

    var server = Cla.ui.ciCombo({
        name: 'server',
        class: 'generic_server',
        fieldLabel: _('Server'),
        value: params.data.server || '',
        allowBlank: false,
        with_vars: 1
    });

    var scriptPath = Cla.ui.textField({
        name: 'scriptPath',
        fieldLabel: _('JMeter Script Path'),
        value: params.data.scriptPath
    });

    var remotePath = Cla.ui.textField({
        name: 'remotePath',
        fieldLabel: _('Remote Server Path'),
        value: params.data.remotePath
    });

    var remoteUser = Cla.ui.textField({
        name: 'remoteUser',
        fieldLabel: _('Remote User'),
        value: params.data.remoteUser
    });

    var commandParameters = new Cla.ui.textArea({
        name: 'commandParameters',
        fieldLabel: _('Command Parameters'),
        value: params.data.commandParameters || '',
        anchor: '100%',
        height: 50
    });

    var errors = new Baseliner.ComboSingle({
        fieldLabel: _('Errors'),
        name: 'errors',
        value: params.data.errors || 'fail',
        data: [
            'fail',
            'warn',
            'custom',
            'silent'
        ]
    });

    var customError = new Ext.Panel({
        layout: 'column',
        fieldLabel: _('Return Codes'),
        frame: true,
        hidden: params.data.errors != 'custom',
        items: [{
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Ok'),
                name: 'rcOk',
                value: params.data.rcOk
            }
        }, {
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Warn'),
                name: 'rcWarn',
                value: params.data.rcWarn
            }
        }, {
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Error'),
                name: 'rcError',
                value: params.data.rcError
            }
        }],
        show_hide: function() {
            errors.getValue() == 'custom' ? this.show() : this.hide();
            this.doLayout();
        }
    });

    errors.on('select', function() {
        customError.show_hide()
    });

    return [
        server,
        scriptPath,
        remotePath,
        remoteUser,
        commandParameters,
        errors,
        customError,
        new Baseliner.ErrorOutputTabs({
            data: params.data
        })
    ]
})
