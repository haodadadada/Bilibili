export default function showCustomAlert(message: string) {
    // 创建样式表
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUpFade {
            0% {
                transform: translate(-50%, 20px);
                opacity: 0;
            }
            20% {
                transform: translate(-50%, -50%);
                opacity: 1;
            }
            80% {
                transform: translate(-50%, -50%);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%);
                opacity: 0;
            }
        }
  
        .custom-alert {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 13px;
            background: #333;
            padding: 12px 10px;
            box-sizing: border-box;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            text-align: left;
            z-index: 1000;
            animation: slideUpFade 1s ease forwards;
            min-width: 50px;
            max-width: 300px;
        }
    `;
    document.head.appendChild(style);
  
    // 创建提示框
    const alertContainer = document.createElement('div');
    alertContainer.className = 'custom-alert';
    alertContainer.textContent = message;
  
    // 添加到页面
    document.body.appendChild(alertContainer);
  
    // 动画结束后移除元素
    alertContainer.addEventListener('animationend', () => {
        document.body.removeChild(alertContainer);
        document.head.removeChild(style);
    });
};
  