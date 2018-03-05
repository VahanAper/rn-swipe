import React from 'react';
import {
    View,
    Animated,
    PanResponder,
} from 'react-native';

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
            onPanResponderRelease: () => {},
        });
    }
    
    getCardStyle = () => {
        const rotate = this.position.x.interpolate({
            inputRange: [ -500, 0, 500 ],
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
