import React from 'react';
import {
    View,
    Animated,
    UIManager,
    Dimensions,
    PanResponder,
    LayoutAnimation,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPTE_OUT_DURATION = 250;
const LEFT = "LEFT";
const RIGHT = "RIGHT";

class Deck extends React.Component {
    static defaultProps = {
        onSwipeLeft: () => {},
        onSwipeRight: () => {},
    }
    
    constructor(props) {
        super(props);
        
        this.state = {
            currentCardIndex: 0,
        };
        
        this.position = new Animated.ValueXY();
        
        this.responder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                this.position.setValue({
                    x: gesture.dx,
                    y: gesture.dy,
                });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipeCardTo(RIGHT);
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipeCardTo(LEFT);
                } else {
                    this.resetPosition();
                }
            },
        });
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ currentCardIndex: 0 });
        }
    }
    
    componentWillUpdate() {
        // For Android
        UIManager.setLayoutAnimationEnabledExperimental
            && UIManager.setLayoutAnimationEnabledExperimental(true);
            
        LayoutAnimation.spring();
    }
    
    forceSwipeCardTo = (direction) => {
        const x = direction === RIGHT 
            ? SCREEN_WIDTH 
            : direction === LEFT 
                ? -SCREEN_WIDTH
                : 0;
        
        Animated.timing(
            this.position,
            {
                toValue: {
                    x,
                    y: 0,
                },
                duration: SWIPTE_OUT_DURATION, // ms
            },
        ).start(() => this.onSwipeComplete(direction));
    }
    
    onSwipeComplete = (direction) => {
        const {
            data,
            onSwipeLeft,
            onSwipeRight,
        } = this.props;
        const {
            currentCardIndex,
        } = this.state;
        
        const item = data[currentCardIndex];
        
        direction === LEFT 
            ? onSwipeLeft(item)
            : direction === RIGHT
                ? onSwipeRight(item)
                : () => {};
        
        // Reset position for next card
        this.position.setValue({ x: 0, y: 0 });
                
        this.setState({ currentCardIndex: currentCardIndex + 1 });
    }
    
    resetPosition = () => {
        Animated.spring(
            this.position, 
            {
                toValue: {
                    x: 0,
                    y: 0,
                },
            },
        ).start();
    }
    
    getCardStyle = () => {
        const rotate = this.position.x.interpolate({
            inputRange: [ -SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5 ],
            outputRange: [ '-120deg', '0deg', '120deg' ],
        });
        
        return {
            ...this.position.getLayout(),
            transform: [{ rotate }],
        };
    }
    
    renderCards = () => {
        const { data } = this.props;
        const { currentCardIndex } = this.state;
        
        if (currentCardIndex >= data.length) {
            return this.props.renderNoMoreCards();
        }
        
        const cards = data.map((item, index) => {
            if (index < currentCardIndex) {
                return null;
            }
            
            if (index === currentCardIndex) {
                return (
                    <Animated.View
                        {...this.responder.panHandlers}
                        style={[
                            this.getCardStyle(),
                            styles.cardStyle,
                            { zIndex: 2 },
                        ]}
                        key={item.id}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            
            return (
                <Animated.View
                    key={item.id}
                    style={[
                        styles.cardStyle,
                        { top: 10 * (index - currentCardIndex) }
                    ]}
                >
                    {this.props.renderCard(item)}
                </Animated.View>
            ); 
        });
        
        return cards.reverse();
    }
    
    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        zIndex: 1,
    },
};

export default Deck;
