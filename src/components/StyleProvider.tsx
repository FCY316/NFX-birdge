import 'react-toastify/dist/ReactToastify.css';

import { ConfigProvider } from 'antd';
import { ToastContainer } from 'react-toastify';

// 从@ant-design/cssinjs中导入px2rem转换器和样式提供者
import {
    legacyLogicalPropertiesTransformer,
    StyleProvider,
} from '@ant-design/cssinjs';

// 定义一个样式提供者组件，它将使用状态管理和样式转换来包装其子组件
const StyleProviderCom = ({ children }: { children: React.ReactNode }) => {

    return (
        <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]} >
            <ToastContainer />
            <ConfigProvider
                theme={{
                    components: {
                        Button: {
                            defaultBg: "#667eea",
                            defaultColor: "#fff",
                            defaultBorderColor: "#667eea",
                            defaultActiveColor: "#fff",
                            defaultActiveBg: "#764ba2",
                            defaultActiveBorderColor: "#764ba2",
                            defaultHoverBg: "#764ba2",
                            defaultHoverBorderColor: "#764ba2",
                            defaultHoverColor: "#fff",
                            borderRadius: 16,
                            controlHeight: 56,
                            fontSize: 16,
                            fontWeight: 600,
                        },
                        Tabs: {
                            colorPrimary: "#667eea",
                            itemColor: "#64748b",
                            lineHeight: 0.875,
                            horizontalItemPadding: "10px 34px",
                        },
                        InputNumber: {
                            colorPrimary: "#667eea",
                            hoverBorderColor: "rgba(102, 126, 234, 0.4)",
                            activeBorderColor: "#667eea",
                            paddingBlock: 12,
                            inputFontSize: 16,
                            borderRadius: 12,
                            colorBorder: "rgba(255, 255, 255, 0.4)",
                            colorBgContainer: "transparent",
                        },
                        Select: {
                            colorPrimary: "#667eea",
                            hoverBorderColor: "rgba(102, 126, 234, 0.4)",
                            optionSelectedBg: "#667eea",
                            optionSelectedColor: "#fff",
                            fontSize: 14,
                            borderRadius: 12,
                        },
                        Form: {
                            fontSize: 14,
                            labelColor: "#64748b",
                            labelFontSize: 14,
                        },
                        Input: {
                            colorPrimary: "#667eea",
                            hoverBorderColor: "rgba(102, 126, 234, 0.4)",
                            activeBorderColor: "#667eea",
                            paddingBlock: 12,
                            inputFontSize: 16,
                            borderRadius: 12,
                            colorBorder: "rgba(255, 255, 255, 0.4)",
                            colorBgContainer: "transparent",
                        },
                        Spin: {
                            colorPrimary: "#667eea",
                        }
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </StyleProvider>
    )
}

// 导出样式提供者组件作为默认导出
export default StyleProviderCom