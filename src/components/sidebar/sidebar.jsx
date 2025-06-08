import React, { useContext, useState } from 'react';
import './sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/context';

const Sidebar = () => {

    const [opened, setOpened] = useState(false);
    const {onSent, previousprompts, setRecentPrompts,newChat} = useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompts(prompt)
        await onSent(prompt)
    }

    return (
        <div className='sidebar'>

            <div className="top">
                <div onClick={()=>opened===false? setOpened(true): setOpened(false)} className="menu-cover">
                    <img className='menu' src={assets.menu_icon} alt="menu_icon" />
                </div>
                
                <div onClick={()=>newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {opened ? <p>New Chat</p> : null}
                </div>
                {opened ?
                    <div className="recent">
                        <p className='recent-title'>Recent</p>
                        {
                            previousprompts.map((item, index)=>{
                                return (
                                    <div onClick={()=>loadPrompt(item)} className="recent-entry">
                                        <img src={assets.message_icon} alt="" />
                                        <p>{item.slice(0,18)} ...</p>
                                    </div>
                                )
                            })
                        }
                        
                    </div> : null
                }

            </div>

            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="Question-Mark" />
                    {opened? <p>Help</p>: null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="Recent-icon" />
                    {opened? <p>Activity</p>: null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="Settings-icon" />
                    {opened? <p>Settings</p>: null}
                </div>
            </div>

        </div>
    );
};

export default Sidebar;