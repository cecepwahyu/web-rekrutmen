import React from 'react';
import Lottie from 'react-lottie';

interface LottieAnimationProps {
    animationData: any;
    height?: number | string;
    width?: number | string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData, height = '100%', width = '100%' }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return <Lottie options={defaultOptions} height={height} width={width} />;
};

export default LottieAnimation;
