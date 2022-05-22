import React from 'react';
import { Upload, Tooltip } from 'antd';
import { CameraFilled, FileAddFilled } from '@ant-design/icons';

const UploadFile = ({ ...props }) => {

return <div style={{ position: 'relative' }}>
        {props?.type === 'picture' ? (
            <Tooltip title={props?.title} placement={props?.placement}>
                <Upload showUploadList={false} className={props?.className} {...(props?.uploadProps ? props?.uploadProps : {})}>
                    <CameraFilled />
                </Upload>
            </Tooltip>
        ) : (
            <Tooltip>
                <Upload showUploadList={false} className={props?.className}>
                    <FileAddFilled />
                </Upload>
            </Tooltip>
        )}
    </div>
}

export default UploadFile;