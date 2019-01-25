import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Card from './components/Card';

const keyToflower = ['Spade', 'Heart', 'Diamond', 'Club']  // 黑桃（Spade）、红桃（Heart）、方块（Diamond）、梅花（Club）

const pokerWidth = Math.floor(Dimensions.get('window').width/7 -40);
const pokerHeight = Math.floor(Dimensions.get('window').width/7 -40) / 63 * 88;

export default class App extends React.Component {

    constructor (props) {
        super(props);
        Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.LANDSCAPE);
        this.state = {
            shownStorePokers: [],
            storePokers: [],
            selected: '',
            tablePokers: [],
            finishPokers: []
        }
    }

    componentWillMount () {
        this.restart()
    }

    restart () {
        let storePokers = [];
        let finishPokers = [...Array(4)].map(()=>[]);
        let tablePokers = [...Array(7)].map(() => []);
        this.initPokers = [...Array(7)].map(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
        for (let i = 0; i < 7; i++) {
            // 从左往右取排
            for (let j = 0; j <= i; j++) {
                tablePokers[i].push({ ...this.randomGetACard(), isOpen: j === i })
            }
        }
        //将剩下的牌全部放入未使用的牌库中
        let card;
        while (card = this.randomGetACard()) {
            storePokers.push({ ...card, isOpen: false});
        }
        this.setState({
            storePokers,
            tablePokers,
            finishPokers
        });
    }

    randomGetACard () {
        if (this.getLeftCard() <= 0) return null;
        let flower
        do {
            flower = Math.floor(Math.random() * 4);
        } while (this.initPokers[flower].length <= 0);
        const number = this.initPokers[flower].splice(Math.floor(Math.random() * this.initPokers[flower].length), 1)[0];
        return {
            flowerKey: flower,
            flowerName: keyToflower[flower],
            flowerColorIsRed: (flower === 1 || flower === 2) ? true : false,
            cardNumber: number
        }
    }

    renderFinishPokers(pokers, index) {
        return (
            <TouchableWithoutFeedback onPress={this._onPressFinish.bind(this, index)}>
                <View style={styles.listBase} key={index}>{pokers.map((poker, index) => <Card key={index} cardNumber={poker.cardNumber} flowerKey={poker.flowerKey} isOpen={poker.isOpen}/>)}</View>
            </TouchableWithoutFeedback>
        )
    }

    getLeftCard () {
        return this.initPokers[0].length + this.initPokers[1].length + this.initPokers[2].length + this.initPokers[3].length;
    }

    _onPressFinish (index) {
        // TODO
        if (!this.state.selected) return;
        let finishPokers = this.state.finishPokers;
        if (finishPokers[index].length <= 0) {
            if (this.state.selected === 'shown') {
                const card = this.state.shownStorePokers[this.state.shownStorePokers.length - 1];
                if (card.cardNumber === 1) {
                    this._fromStoreToFinish(index);
                }
            } else if (this.state.selected.indexOf('table_') === 0) {
                let fromIndex = this.state.selected.split('_')[1]
                const card = this.state.tablePokers[fromIndex][this.state.tablePokers[fromIndex].length - 1];
                if (card.cardNumber === 1) {
                    this._fromTableToFinish(index, fromIndex);
                }
            }
        } else {
            const lastCard = finishPokers[index][finishPokers[index].length - 1];
            if (this.state.selected === 'shown') {
                const card = this.state.shownStorePokers[this.state.shownStorePokers.length - 1];
                if (card.flowerKey === lastCard.flowerKey && card.cardNumber - 1 === lastCard.cardNumber) {
                    this._fromStoreToFinish(index);
                }
            } else if (this.state.selected.indexOf('table_') === 0) {
                let fromIndex = this.state.selected.split('_')[1]
                const card = this.state.tablePokers[fromIndex][this.state.tablePokers[fromIndex].length - 1];
                if (card.flowerKey === lastCard.flowerKey && card.cardNumber - 1 === lastCard.cardNumber) {
                    this._fromTableToFinish(index, fromIndex);
                }
            }
        }

        this._cleanSelect();
    }

    _fromStoreToFinish (index) {
        let finishPokers = this.state.finishPokers;
        let shownStorePokers = this.state.shownStorePokers;
        finishPokers[index].push(shownStorePokers.pop());
        this.setState({
            finishPokers,
            shownStorePokers
        });
    }

    _fromTableToFinish (index, from) {
        let finishPokers = this.state.finishPokers;
        let tablePokers = this.state.tablePokers;
        finishPokers[index].push(tablePokers[from].pop());
        if (tablePokers[from].length > 0) {
            tablePokers[from][tablePokers[from].length - 1].isOpen = true;
        }
    }

    _onPressStore () {
        this._cleanSelect();
        // 都没牌了
        if (this.state.storePokers.length <=0 && this.state.shownStorePokers.length <= 0) {
            return null;
        }
        let storePokers = this.state.storePokers;
        let shownStorePokers = this.state.shownStorePokers;
        // 分为牌库还有排和牌库没牌了两种情况
        if (storePokers.length > 0) {
            let poker;
            let counter = 0;
            while (counter < 3 && (poker = storePokers.pop())) {
                poker.isOpen = true;
                shownStorePokers.push(poker);
                counter ++;
            }
            this.setState({
                storePokers,
                shownStorePokers
            });
        } else {
            shownStorePokers.map(poker => poker.isOpen = false);
            shownStorePokers.reverse();
            this.setState({
                storePokers: shownStorePokers,
                shownStorePokers: []
            });
        }
    }

    _onPressShownStore () {
        if (!this.state.selected) {
            this.setState({selected: 'shown'});
        } else {
            this._cleanSelect();
        }
    }

    _cleanSelect() {
        this.setState({
            selected: null
        })
    }

    _tablePokerSelect(index) {
        if (this.state.selected === 'shown') {
            if (this.state.tablePokers[index].length) {
                let shownCard = this.state.shownStorePokers[this.state.shownStorePokers.length - 1];
                let tableCard = this.state.tablePokers[index][this.state.tablePokers[index].length -1];
                if (shownCard.flowerColorIsRed !== tableCard.flowerColorIsRed && (tableCard.cardNumber - 1) === shownCard.cardNumber) {
                    this._fromShownToTable(index)
                }
            } else {
                this._fromShownToTable(index)
            }

            this._cleanSelect();
        } else if (!this.state.selected) {
            this.setState({ selected: 'table_'+index})
        } else if (this.state.selected.indexOf('table_') === 0) {
            let fromIndex = this.state.selected.split('_')[1]
            if (index !== fromIndex) {
                let fromTableIndex = -1;
                let fromTable =  this.state.tablePokers[fromIndex];
                if (this.state.tablePokers[index].length) {
                    let toTableCard = this.state.tablePokers[index][this.state.tablePokers[index].length -1];
                    for (let i = 0; i < fromTable.length; i ++) {
                        if (!fromTable[i].isOpen) continue;
                        if (fromTable[i].flowerColorIsRed !== toTableCard.flowerColorIsRed && (toTableCard.cardNumber - 1) === fromTable[i].cardNumber) {
                            fromTableIndex = i;
                            break
                        }
                    }
                } else {
                    for (let i = 0; i < fromTable.length; i ++) {
                        if (!fromTable[i].isOpen) continue;
                        if (fromTable[i].cardNumber === 13) {
                            fromTableIndex = i;
                            break
                        }
                    }
                }
                if (fromTableIndex > -1) {
                    this._fromTableToTable(fromIndex, index, fromTableIndex);
                }
            }
            this._cleanSelect();
        }
    }

    _fromTableToTable(fromIndex, toIndex, fromTableIndex) {
        let tablePokers = this.state.tablePokers;
        tablePokers[toIndex] = tablePokers[toIndex].concat(tablePokers[fromIndex].splice(fromTableIndex, tablePokers[fromIndex].length-fromTableIndex));
        if (tablePokers[fromIndex].length > 0) {
            tablePokers[fromIndex][tablePokers[fromIndex].length - 1].isOpen = true;
        }
        this.setState({tablePokers})
    }

    _fromShownToTable (index) {
        let shownStorePokers = this.state.shownStorePokers;
        let tablePokers = this.state.tablePokers;
        tablePokers[index].push(shownStorePokers.pop());
        this.setState({
            tablePokers,
            shownStorePokers
        });
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={[styles.storeArea, {height: Math.floor(Dimensions.get('window').width/7 -40) / 63 * 88}]}>
                    <View style={styles.storePokers}>
                        <TouchableOpacity onPress={this._onPressStore.bind(this)}>
                            <View style={styles.listBase}>
                                {this.state.storePokers.map((poker, index) => (<Card key={index} style={{left: index*0.3}} cardNumber={poker.cardNumber} flowerKey={poker.flowerKey} isOpen={poker.isOpen} />))}
                            </View>
                        </TouchableOpacity>
                        <TouchableWithoutFeedback onPress={this._onPressShownStore.bind(this)}>
                        <View style={{width: pokerWidth*2}}>

                            {this.state.shownStorePokers.map((poker, index) => (<Card key={index} style={[
                                {left: index > (this.state.shownStorePokers.length -3) ? (index - this.state.shownStorePokers.length + 3) * 25 : 0}]} cardNumber={poker.cardNumber} flowerKey={poker.flowerKey} isOpen={poker.isOpen} isSelected={index === this.state.shownStorePokers.length - 1 && this.state.selected==='shown'}/>))}

                        </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.finishArea}>
                        { this.state.finishPokers.map((pokers, index) => this.renderFinishPokers(pokers, index)) }
                    </View>
                </View>
                <View style={styles.table}>
                    {this.state.tablePokers.map((pokers, index) => (<TouchableWithoutFeedback key={index} onPress={this._tablePokerSelect.bind(this, index)}><View style={{ position: 'relative', width: pokerWidth, height: pokerHeight * 2 }}>
                        {pokers.map((poker, index) => (<Card key={index} style={{top: index*15}} cardNumber={poker.cardNumber} flowerKey={poker.flowerKey} isOpen={poker.isOpen} />))}
                    </View></TouchableWithoutFeedback>))}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: '#0f8013',
    },
    table: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        justifyContent: 'space-around',
        paddingLeft: 20,
        paddingRight: 20
    },
    storeArea: {
        marginTop: 10,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 5,
        flexDirection: 'row'
    },
    storePokers: {
        position: 'relative',
        width: '50%',
        flexDirection: 'row'
    },
    finishArea: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listBase: {
        borderWidth: 1,
        borderColor: '#999',
        borderStyle: 'dashed',
        borderRadius: 10,
        width: Math.floor(Dimensions.get('window').width/7 -40),
        height: Math.floor(Dimensions.get('window').width/7 -40) / 63 * 88,
        marginLeft: 10,
        marginRight: 15
    }
});
