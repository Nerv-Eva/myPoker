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
            height: Math.floor(Dimensions.get('window').width/7 -40) / 63 * 88
        }
    }

    componentWillMount () {
        Dimensions.addEventListener('change', ({window}) => {
            this.setState({
                width: Math.floor(window.width/7 -40),
                height: Math.floor(window.width/7 -40) / 63 * 88
            });
        });
    }

    getFlowerImage () {
        if (this.props.flowerKey === 0) {
            return (
                <Image
                source={require('../assets/Spade.png')}
                resizeMode={'stretch'}
                style={{width: this.state.width/5, height: this.state.width/5}} />);
        }
        if (this.props.flowerKey === 1) {
            return (
                <Image
                    source={require('../assets/Heart.png')}
                    resizeMode={'stretch'}
                    style={{width: this.state.width/5, height: this.state.width/5}} />);
        }
        if (this.props.flowerKey === 2) {
            return (
                <Image
                    source={require('../assets/Diamond.png')}
                    resizeMode={'stretch'}
                    style={{width: this.state.width/5, height: this.state.width/5}} />);
        }
        if (this.props.flowerKey === 3) {
            return (
                <Image
                    source={require('../assets/Club.png')}
                    resizeMode={'stretch'}
                    style={{width: this.state.width/5, height: this.state.width/5}} />);
        }
    }

    render () {
        if (!this.props.isOpen) {
            return (<Image
                source={require('../assets/back.png')}
                resizeMode={'stretch'}
                style={[{width: this.state.width, height: this.state.height}, styles.container, this.props.style]}
            ></Image>);
        }

        return (
            <View style={[styles.container, { width: this.state.width, height: this.state.height }, this.props.isSelected ? {borderWidth: 4, borderColor: '#00a5a6'} : {}, this.props.style]}>
                <View style={[styles.cardMark, {width: this.state.width/5, height: this.state.width/5}]}>
                    <Text style={[styles.cardName, {color: (this.props.flowerKey === 1 || this.props.flowerKey === 2) ? 'red' : 'black'}]}>{numberToName[this.props.cardNumber]}</Text>
                    {this.getFlowerImage()}
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