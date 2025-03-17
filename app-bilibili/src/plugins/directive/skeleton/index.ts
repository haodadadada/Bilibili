/**
 * @description: 骨架屏指令
 * 在图片加载完成之前，显示骨架屏  骨架元素会成为传入元素的第一个子元素，传入元素的其他子元素会被隐藏
 */
export default {
    mounted(el: HTMLElement) {
        const img = el.querySelector('img');
        if (!img) return;
        const style = document.createElement('style');
        style.className = 'skeleton-style';
        const coverRadio = 56.25;
        // 定义样式内容
        const styles = `
            .box-card-skeleton-plugins {
                position: absolute;
                left: 0;
                top: 0;
                pointer-events: none;
                user-select: none;
                width: 100%;
                height: 100%;
            }
        
            .box-card-skeleton-plugins .card-skeleton-cover-plugins {
                padding-top: ${coverRadio}%;
                background: linear-gradient(
                    -45deg,
                    var(--graph_bg_regular) 25%,
                    var(--bg1) 45%,
                    var(--graph_bg_regular) 65%
                );
                background-size: 400% 100%;
                animation: skeleton-loading 1.2s ease-in-out infinite;
                border-radius: 5px;
            }
        
            @keyframes skeleton-loading {
                0% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0 50%;
                }
            }
        
            .box-card-skeleton-plugins .card-skeleton-info-plugins {
                margin-top: var(--info-margin-top);
            }
        
            .box-card-skeleton-plugins .card-skeleton-text-plugins {
                margin-bottom: 4px;
                width: 94%;
                height: calc(var(--title-line-height) - 4px);
                border-radius: 4px;
                background-color: var(--graph_bg_regular);
            }
        
            .box-card-skeleton-plugins .card-skeleton-text-plugins.short {
                width: 74%;
            }
        
            .box-card-skeleton-plugins .card-skeleton-text-light-plugins {
                margin-top: 8px;
                width: 50%;
                height: var(--subtitle-line-height);
                border-radius: 4px;
                background-color: var(--graph_bg_regular);
            }
        `;
        style.innerHTML = styles;
        document.head.appendChild(style);
        Array.from(el.children).forEach((child: Element) => {
            if(child instanceof HTMLElement) child.style.opacity = '0';
        });
        const skeleton = document.createElement('div');
        skeleton.className = 'box-card-skeleton-plugins';
        skeleton.innerHTML = `
            <div class='card-skeleton-cover-plugins'></div>
            <div class='card-skeleton-info-plugins'>
                <p class='card-skeleton-text-plugins'></p>
                <p class='card-skeleton-text-plugins short'></p>
                <p class='card-skeleton-text-light-plugins'></p>
            </div>
        `;
        el.prepend(skeleton);
        img.addEventListener('load', () => {
            skeleton.remove();
            Array.from(el.children).forEach((child: Element) => {
                if(child instanceof HTMLElement) child.style.opacity = '1';
            });
        });
      },
      beforeUnmount(el: HTMLElement) {
        const img = el.querySelector('img');
        if (img) img.onload = null;
        const styleTag = document.querySelector('.skeleton-style');
        if (styleTag) {
            styleTag.remove();  // 移除插入的样式
        };
        
    }
};
  