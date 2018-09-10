import React from 'react';
import { Dialog, Button, Classes } from '@blueprintjs/core';

const ConfirmDialog = ({ isOpen, loading, hideDialog, deleteHandeler }) => (
    <Dialog title="Confirm deletion" isOpen={isOpen} onClose={hideDialog}>
        <div className={Classes.DIALOG_BODY}>Are you sure you want to delete this record?</div>
        <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button onClick={hideDialog}>Cancel</Button>
                <Button loading={loading} intent="danger" onClick={deleteHandeler}>
                    Delete
                </Button>
            </div>
        </div>
    </Dialog>
);

export default ConfirmDialog;
