// components/Icon.tsx
import { ReactSVG } from 'react-svg';

interface IconProps {
    src: string;
    className?: string;
}

export default function Icon({ src, className }: IconProps) {
    return (
        <ReactSVG
            src={src}
            className={className}
            beforeInjection={(svg) => {
                // 删除 svg 自身的 width 和 height
                svg.removeAttribute('width');
                svg.removeAttribute('height');

                // 遍历所有 path，清除 fill，改成 currentColor
                const paths = svg.querySelectorAll('path');
                paths.forEach((path) => {
                    path.removeAttribute('fill');
                    path.setAttribute('fill', 'currentColor');
                });
            }}
        />
    );
}