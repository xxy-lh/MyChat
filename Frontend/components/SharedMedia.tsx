import React, { useState } from 'react';
import { MEDIA_ITEMS } from '../constants';

const SharedMedia: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'media' | 'files' | 'links'>('media');

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <header className="flex items-center justify-between border-b border-solid dark:border-border-dark bg-white dark:bg-background-dark px-6 py-3 z-20 shrink-0">
        <div className="flex items-center gap-6">
          <button className="flex items-center justify-center size-8 rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors text-slate-500 dark:text-text-secondary">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold leading-tight tracking-tight">共享内容</h2>
            <span className="text-xs font-medium text-slate-500 dark:text-text-secondary">查看共享的项目</span>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-4">
          <div className="flex w-full max-w-sm items-center rounded-lg bg-slate-100 dark:bg-surface-dark h-10 px-3 border border-transparent focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-slate-400 dark:text-text-secondary text-[20px]">search</span>
            <input className="flex-1 bg-transparent border-none text-sm px-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:ring-0" placeholder="搜索..." />
          </div>
        </div>
      </header>
      <div className="w-full border-b border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark px-6 z-10 shrink-0">
        <nav className="flex gap-8 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 border-b-[3px] pb-3 pt-4 transition-colors ${activeTab === 'media' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-text-secondary hover:text-slate-700 dark:hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[20px]">image</span>
            <span className="text-sm font-bold">媒体</span>
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 border-b-[3px] pb-3 pt-4 transition-colors ${activeTab === 'files' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-text-secondary hover:text-slate-700 dark:hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[20px]">folder</span>
            <span className="text-sm font-bold">文件</span>
          </button>
          <button 
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 border-b-[3px] pb-3 pt-4 transition-colors ${activeTab === 'links' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-text-secondary hover:text-slate-700 dark:hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[20px]">link</span>
            <span className="text-sm font-bold">链接</span>
          </button>
        </nav>
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 scroll-smooth">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            
            {activeTab === 'media' && (
                <section>
                <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-3 mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-bold">最近媒体</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {MEDIA_ITEMS.map((item) => (
                        <div key={item.id} className="break-inside-avoid mb-4 group relative cursor-pointer overflow-hidden rounded-lg bg-surface-dark">
                            <img className="w-full h-auto object-cover transform transition-transform duration-300 group-hover:scale-105" src={item.url} alt="Media" />
                            {item.type === 'video' && (
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-[14px]">play_circle</span> {item.duration}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                                <span className="text-white text-xs font-medium">{item.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
                </section>
            )}

            {activeTab === 'files' && (
                <section className="flex flex-col items-center justify-center h-full pt-20 text-slate-500">
                    <span className="material-symbols-outlined text-6xl mb-4 text-slate-300 dark:text-slate-700">folder_open</span>
                    <p>暂无共享文件。</p>
                </section>
            )}

            {activeTab === 'links' && (
                <section className="flex flex-col items-center justify-center h-full pt-20 text-slate-500">
                    <span className="material-symbols-outlined text-6xl mb-4 text-slate-300 dark:text-slate-700">link_off</span>
                    <p>暂无链接。</p>
                </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default SharedMedia;