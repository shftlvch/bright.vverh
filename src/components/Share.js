/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
    ShareButtons,
    ShareCounts,
    generateShareIcon,
} from 'react-share';

import "./Share.css";

// import exampleImage from './react-share-pin-example.png';

const {
    FacebookShareButton,
    VKShareButton,
    TelegramShareButton,
    WhatsappShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const VKIcon = generateShareIcon('vk');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');

class Share extends Component {
    render() {
        const shareUrl = 'http://bright.vverh.su/';
        const title = '#мне_не_серо_когда';

        return (
            <div className="share">
                <div className="share__item">
                    <FacebookShareButton
                        url={shareUrl}
                        quote={title}
                        className="share__item__share-button">
                        <FacebookIcon
                            size={32}
                            round />
                    </FacebookShareButton>
                </div>

                <div className="share__item">
                    <TelegramShareButton
                        url={shareUrl}
                        title={title}
                        className="share__item__share-button">
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </div>

                <div className="share__item">
                    <WhatsappShareButton
                        url={shareUrl}
                        title={title}
                        separator=":: "
                        className="share__item__share-button">
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </div>

                <div className="share__item">
                    <VKShareButton
                        url={shareUrl}
                        // image={`${String(window.location)}/${exampleImage}`}
                        windowWidth={660}
                        windowHeight={460}
                        className="share__item__share-button">
                        <VKIcon
                            size={32}
                            round />
                    </VKShareButton>
                </div>

            </div>
        );
    }
}

export default Share;