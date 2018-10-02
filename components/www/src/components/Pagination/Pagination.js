import React, { Component } from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';

const getAmount = (total, pageSize) => Math.ceil(total / pageSize);

class Pagination extends Component {
    getButton = (index, disabled = false) => {
        const { current, handler } = this.props;
        return (
            <Button
                disabled={disabled || index === current}
                active={index === current}
                key={index}
                onClick={() => handler(index)}
            >
                {disabled ? '...' : index + 1}
            </Button>
        );
    };

    getButtons = () => {
        const { total, current, pageSize } = this.props;
        const amount = getAmount(total, pageSize);

        if (amount < 10) {
            return Array(amount)
                .fill(0)
                .map((_, index) => this.getButton(index));
        }

        const buttons = Array(amount)
            .fill(0)
            .reduce((ac, _, index) => {
                return [0, 1, current - 1, current, current + 1, amount - 2, amount - 1].includes(
                    index
                )
                    ? [...ac, this.getButton(index)]
                    : ac;
            }, []);

        if (current > 3) {
            buttons.splice(2, 0, this.getButton(2, true));
        }

        if (current < amount - 4) {
            buttons.splice(-2, 0, this.getButton(amount - 3, true));
        }

        return buttons;
    };

    render() {
        const { total, current, handler, pageSize } = this.props;
        if (!total || total <= pageSize) {
            return null;
        }

        const buttons = this.getButtons();
        return (
            <ButtonGroup>
                <Button
                    icon="arrow-left"
                    disabled={current === 0}
                    onClick={() => handler(current - 1)}
                />
                {buttons}
                <Button
                    icon="arrow-right"
                    disabled={current === getAmount(total, pageSize) - 1}
                    onClick={() => handler(current + 1)}
                />
            </ButtonGroup>
        );
    }
}

export default Pagination;
