import React from 'react';

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}

/**
 * 主题切换按钮组件
 * 支持日间/夜间模式切换
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="size-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all duration-300"
            aria-label={isDark ? '切换到日间模式' : '切换到夜间模式'}
            title={isDark ? '日间模式' : '夜间模式'}
        >
            <span className="material-symbols-outlined text-slate-900 dark:text-white transition-transform duration-300">
                {isDark ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    );
};

export default ThemeToggle;
