import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {
    Card,
    Button,
} from 'react-native-elements';

import Deck from './src/Deck';

import { DATA } from './src/data';

export default class App extends React.Component {
    renderCard(item) {
        return (
            <Card
                key={item.id}
                title={item.text}
                image={{
                    uri: item.uri
                }}
            >
                <Text style={{ marginBottom: 10 }}>
                    Long Descriptionssss
                </Text>
                <Button
                    icon={{ name: 'code' }}
                    backgroundColor="#03A9F4"
                    title="View"
                />
            </Card>
        );
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Deck
                    data={DATA}
                    renderCard={this.renderCard}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
