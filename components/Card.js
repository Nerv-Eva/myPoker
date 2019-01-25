import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

const keyToflower = ['Spade', 'Heart', 'Diamond', 'Club']  // 黑桃（Spade）、红桃（Heart）、方块（Diamond）、梅花（Club）

const numberToName = {
    1: 'A',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'J',
    12: 'Q',
    13: 'K'
}

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            width: Math.floor(Dimensions.get('window').width/7 -40),
            height: Math.floor(Dimensions.get('window').width/7 -40) / 63 * 88,
            cardNumber: this.props.cardNumber,
            flowerKey: this.props.flowerKey,
            style: this.props.style
        }
    }

    render () {
        if (!this.props.isOpen) {
            return (<Image
                source={require('../assets/back.png')}
                resizeMode={'stretch'}
                style={[{width: this.state.width, height: this.state.height}, styles.container, this.state.style]}
            ></Image>);
        }
        let image;
        do {
            if (this.state.flowerKey === 0) {
                image = require('../assets/Spade.png');
                break;
            }
            if (this.state.flowerKey === 1) {
                image = require('../assets/Heart.png');
                break;
            }
            if (this.state.flowerKey === 2) {
                image = require('../assets/Diamond.png');
                break;
            }
            if (this.state.flowerKey === 3) {
                image = require('../assets/Club.png');
                break;
            }

        } while(false);

        return (
            <View style={[styles.container, { width: this.state.width, height: this.state.height }, this.props.isSelected ? {borderWidth: 4, borderColor: '#00a5a6'} : {}, this.state.style]}>
                <View style={[styles.cardMark, {width: this.state.width/5, height: this.state.width/5}]}>
                    <Text style={styles.cardName}>{numberToName[this.state.cardNumber]}</Text>
                    <Image
                        source={image}
                        resizeMode={'stretch'}
                        style={{width: this.state.width/5, height: this.state.width/5}}
                    ></Image>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#999',
        position: 'absolute'
    },
    cardMark: {
        position: 'absolute',
        top: 5,
        left:5
    },
    cardName: {
        width: '100%',
        textAlign: 'center'
    }
});