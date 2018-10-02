import React from 'react';
import { Button } from '@blueprintjs/core';

const exportToJSON = data => {
    const dataStr = JSON.stringify(data, null, '\t');
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');

    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'data.json');

    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
};

const ExportButton = ({ data, disabled }) => (
    <Button
        disabled={disabled}
        icon="export"
        text="Export records"
        onClick={() => exportToJSON(data)}
    />
);

export default ExportButton;
