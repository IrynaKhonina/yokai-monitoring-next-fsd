export const toast = {
    success: (message: string) => {
        const toast = document.createElement('div')
        toast.textContent = `✅ ${message}`

        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease',
            fontSize: '14px',
            fontWeight: '500',
        })

        document.body.appendChild(toast)

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease'
            setTimeout(() => toast.remove(), 300)
        }, 3000)
    },

    error: (message: string) => {
        const toast = document.createElement('div')
        toast.textContent = `❌ ${message}`

        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#ef4444',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease',
            fontSize: '14px',
            fontWeight: '500',
        })

        document.body.appendChild(toast)

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease'
            setTimeout(() => toast.remove(), 300)
        }, 3000)
    }
}

// Add toast animations to document head if not already present
if (typeof document !== 'undefined') {
    const styleId = 'toast-animations'
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `
        document.head.appendChild(style)
    }
}