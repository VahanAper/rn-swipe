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
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        {...this.responder.panHandlers}
                        style={this.position.getLayout()}
                        key={item.id}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
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
