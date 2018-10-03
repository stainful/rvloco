import React, { Fragment } from 'react';
import { H4 } from '@blueprintjs/core';
import styled from 'styled-components';

const List = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    overflow-y: scroll;
`;

const ListItem = styled.li`
    padding-bottom: 10px;
    &:last-of-type {
        padding-bottom: 0;
    }
`;

const Line = styled.div`
    word-break: break-all;
`;

const History = ({ records }) => {
    return (
        <Fragment>
            <H4>Change history</H4>
            <List>
                {[...records].reverse().map(({ data, login, ts }) => (
                    <ListItem key={ts}>
                        <div>
                            {login} {ts}
                        </div>
                        <Line>
                            <b>En:</b> {data.en_translation}
                        </Line>
                        <Line>
                            <b>Ru:</b> {data.ru_translation}
                        </Line>
                    </ListItem>
                ))}
            </List>
        </Fragment>
    );
};

export default History;
