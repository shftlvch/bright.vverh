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
            <div className="Share">
                <div className="Share__item">
                    <FacebookShareButton
                        url={shareUrl}
                        quote={title}
                        className="Share__item__share-button">
                        <FacebookIcon
                            size={32}
                            round />
                    </FacebookShareButton>
                </div>

                <div className="Share__item">
                    <TelegramShareButton
                        url={shareUrl}
                        title={title}
                        className="Share__item__share-button">
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </div>

                <div className="Share__item">
                    <WhatsappShareButton
                        url={shareUrl}
                        title={title}
                        separator=":: "
                        className="Share__item__share-button">
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </div>

                <div className="Share__item">
                    <VKShareButton
                        url={shareUrl}
                        // image={`${String(window.location)}/${exampleImage}`}
                        windowWidth={660}
                        windowHeight={460}
                        className="Share__item__share-button">
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