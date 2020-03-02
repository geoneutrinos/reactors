import React, { useState } from 'react';
import {Card, Form, ListGroup} from 'react-bootstrap';
import {ReactorCore} from '../reactor-cores';

export function CoreList({cores, reactorLFStart, reactorLFEnd}) {
    const [filter, setFilter ] = useState("");

    const coreObjs = Object.values(cores);


    function testCore(core, filter){
        if (filter === ""){
            return true
        }
        const reg = new RegExp(filter, 'i')
        return reg.test(core.name)
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
                {coreObjs.filter((core) => testCore(core, filter)).sort(ReactorCore.sortCompare).map((core) => {
                    const lf = core.loadFactor(reactorLFStart, reactorLFEnd);
                    let variant = "secondary";
                    if (lf > 1){
                        variant = "danger"
                    }else if (lf > 0.75){
                        variant = "success";
                    } else if (lf > 0) {
                        variant = "warning"
                    }
                    return (<ListGroup.Item key={core.name} variant={variant}>
                        <h6>{core.name}</h6>
                        Load Factor: {(lf * 100).toFixed(1)}%<br />
                        Operating Power: { (lf * core.power).toFixed(0)} MW
                    </ListGroup.Item>)
                })}
            </ListGroup>
        </Card>
    )
}