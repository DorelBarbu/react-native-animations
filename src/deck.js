import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {

    constructor(props) {
        super(props);
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                return true;
            },
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if(gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipeRight();
                    return;
                } else if(gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipeLeft();
                    return;
                }
                this.resetPosition();
            }
        });
        this.state = { panResponder, position };
    }

    forceSwipeRight = () => {
        console.log('force swipre right called');
        Animated.timing(this.state.position,{
            toValue: {x: SCREEN_WIDTH, y: 0},
            duration: SWIPE_OUT_DURATION
        }).start();
    }

    forceSwipeLeft = () => {
        console.log('force swipre right called');
        Animated.timing(this.state.position,{
            toValue: {x: -SCREEN_WIDTH, y: 0},
            duration: SWIPE_OUT_DURATION
        }).start();
    }

    resetPosition = () => {
        Animated.spring(this.state.position,{
            toValue: {x: 0, y: 0}
        }).start();
    }

    getCardStyle = () => {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH*1.5, 0, SCREEN_WIDTH*1.5],
            outputRange: ['-120deg','0deg','120deg']
        });
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        }
    }

    renderCards() {
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        key={item.id}
                        {...this.state.panResponder.panHandlers}
                        style={this.getCardStyle()}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>);
            }
            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;