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
    
    renderCards = () => {
        return this.props.data.map(this.props.renderCard);
    }
    
    render() {
        return (
            <Animated.View
                {...this.responder.panHandlers}
                style={this.position.getLayout()}
            >
                
                {this.renderCards()}
                
            </Animated.View>
        );
    }
}

export default Deck;
