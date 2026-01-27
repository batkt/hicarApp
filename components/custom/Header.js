import React from 'react'
import { Body, Button, Header, Icon, Left, Right, Text, Title } from 'native-base'

function Tolgoi() {
    return (
        <Header >
            <Left>
                <Button transparent>
                    <Icon name="arrow-back" />
                </Button>
            </Left>
            <Body>
                <Title>Transparent</Title>
            </Body>
            <Right>
                <Button transparent>
                    <Text>Cancel</Text>
                </Button>
            </Right>
        </Header>
    )
}

export default Tolgoi
