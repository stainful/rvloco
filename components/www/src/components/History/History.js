import React, { Fragment } from 'react';
import { H4 } from '@blueprintjs/core';
import styled from 'styled-components';

const Header = styled(H4)`
    padding-top: 10px !important;
`;

const List = styled.ul`
    padding: 0;
    list-style: none;
`;

const ListItem = styled.li`
    padding-bottom: 10px;
`;

const History = ({ records }) => {
    return (
        <Fragment>
            <Header>Change history</Header>
            <List>
                {[...records].reverse().map(({ data, login, ts }) => (
                    <ListItem key={ts}>
                        <div>
                            {login} {ts}
                        </div>
                        <div>
                            <b>En:</b> {data.en_translation}
                        </div>
                        <div>
                            <b>Ru:</b> {data.ru_translation}
                        </div>
                    </ListItem>
                ))}
            </List>
        </Fragment>
    );
};

export default History;
