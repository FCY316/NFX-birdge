import {
    Dropdown,
    MenuProps,
} from 'antd';
import { useTranslation } from 'react-i18next';

import languageImg from '@/image/languageImg.svg';
import useLanguage from '@/store/useLanguage';
import Icon from '@/components/Icon';

// 定义下拉菜单的语言选项
const items: MenuProps['items'] = [
    { key: 'zh', label: '中文' },
    { key: 'en', label: 'English' },
    { key: 'ko', label: '한국어' },
    { key: 'ja', label: '日本語' },
];

// 语言切换组件，点击图标后弹出语言选择菜单
const Language = () => {
    const { setLanguage } = useLanguage()
    const { i18n } = useTranslation();    // 语言切换的点击事件处理
    const onClick = ({ key }: { key: string }) => {
        i18n.changeLanguage(key);
        setLanguage(key)
    };

    return (
        <Dropdown menu={{ items, onClick }} placement="bottom" trigger={['click']}>
            <div className='glass-card p-1.5 sm:p-2 rounded-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105'>
                <Icon
                    src={languageImg}
                    className="w-3.5 sm:w-4"
                />
            </div>
        </Dropdown>
    );
};

export default Language;