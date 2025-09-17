import React, { useState } from "react";
import { range } from "lodash";
import { Form, Card } from "react-bootstrap";

const years = range(2003, 2025);
const months = range(1, 13);

export const CoreIAEARange = ({
  reactorLF,
  setReactorLF
}) => {
  const [startYear, setStartYear] = useState(reactorLF.start.getUTCFullYear());
  const [startMonth, setStartMonth] = useState(
    reactorLF.start.getUTCMonth() + 1
  );
  const [endYear, setEndYear] = useState(reactorLF.end.getUTCFullYear());
  const [endMonth, setEndMonth] = useState(reactorLF.end.getUTCMonth() + 1);

  const checkAndSet = ({ startYear, startMonth, endYear, endMonth }) => {
    if (endYear < startYear) {
      endYear = startYear;
      endMonth = startMonth;
    }
    if (endYear === startYear && endMonth < startMonth) {
      endMonth = startMonth;
    }
    setStartYear(startYear);
    setStartMonth(startMonth);
    setEndYear(endYear);
    setEndMonth(endMonth);
    setReactorLF({
      start: new Date(Date.UTC(startYear, startMonth - 1)),
      end: new Date(Date.UTC(endYear, endMonth - 1)),
    });
  };

  const handleChange = (event) => {
    const id = event.target.id;
    const value = parseInt(event.target.value);
    checkAndSet({
      startYear: startYear,
      startMonth: startMonth,
      endYear: endYear,
      endMonth: endMonth,
      [id]: value,
    });
  };

  const yearOptions = years.map((year) => (
    <option value={year} key={year}>
      {year}
    </option>
  ));
  const monthOptions = months.map((month) => (
    <option value={month} key={month}>
      {("0" + month).slice(-2)}
    </option>
  ));
  return (
    <Card>
      <Card.Header>IAEA Load Factor Date Range</Card.Header>
      <Card.Body>
        <Form inline>
          <Form.Control
            id="startYear"
            onChange={handleChange}
            as="select"
            value={startYear}
          >
            {yearOptions}
          </Form.Control>
          <Form.Control
            id="startMonth"
            onChange={handleChange}
            as="select"
            value={startMonth}
          >
            {monthOptions}
          </Form.Control>
          &nbsp;through&nbsp;
          <Form.Control
            id="endYear"
            onChange={handleChange}
            as="select"
            value={endYear}
          >
            {yearOptions}
          </Form.Control>
          <Form.Control
            id="endMonth"
            onChange={handleChange}
            as="select"
            value={endMonth}
          >
            {monthOptions}
          </Form.Control>
        </Form>
        <p>
          <br />
          Monthly load factor (LF) data for the years starting with 2020 are from 
          <a href="https://pris.iaea.org/pris/home.aspx/"> IAEA - Power Reactor Information System (PRIS) </a> 
          and for the earlier years 2003 to 2019 from 
          <a href="https://www.fe.infn.it/antineutrino/"> INFN Antineutrinos</a>. If
          selecting the "Use IAEA LF Data" (default) option,
          the thermal power is averaged over the selected Year-Month range.
        </p>
      </Card.Body>
    </Card>
  );
};
