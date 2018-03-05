import React from 'react';
import {
    View,
    Animated,
    Dimensions,
    PanResponder,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Deck extends React.Component {
    constructor(props) {
        super(props);
        
        this.position = new Animated.ValueXY();
        
        this.responder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                this.position.setValue({
                    x: gesture.dx,
                    y: gesture.dy,
                });
            },
            onPanResponderRelease: () => {
                this.resetPosition()
            },
        });
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
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        {...this.responder.panHandlers}
                        style={this.getCardStyle()}
                        key={item.id}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
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
