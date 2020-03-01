import React, { useState } from 'react';
import {Card, Form, ListGroup} from 'react-bootstrap';
import {ReactorCore} from '../reactor-cores';

export function CoreList({coreList, reactorLFStart, reactorLFEnd}) {
    const [filter, setFilter ] = useState("");

    function test(value, filter){
        if (filter === ""){
            return true
        }
        const reg = new RegExp(filter, 'i')
        return reg.test(value)
    }

    return (
        <Card>
            <Card.Header>
                <Form inline>
                    <h5 className="mr-auto">Core List</h5>
                    <Form.Control value={filter} onInput={({target:{ value }}) => setFilter(value)} type="search" placeholder="Filter Core List" className="mr-sm-2" />
                </Form>
            </Card.Header>
            <ListGroup variant="flush">
                {coreList.filter((core) => test(core.name, filter)).sort(ReactorCore.sortCompare).map((core) => (
                    <ListGroup.Item key={core.name}>
                        <h6>{core.name}</h6>
                        Load Factor: {(core.loadFactor(reactorLFStart, reactorLFEnd) * 100).toFixed(1)}%
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    )
}