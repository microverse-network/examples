import React from 'react'
import PropTypes from 'prop-types'

import { H11 } from '../Boxes'
import { Slide, Accent, Paragraph1, Row, Task, Quarter } from './SlideBoxes'

const RoadmapSlide = () => {
  return (
    <Slide>
      <H11>
        Roadmap: Decentralize <Accent>Regular</Accent> Apps
      </H11>
      <Paragraph1>
        Develop microservice cryptographic checks via randomized fn I/O
        verification. Similar to proof of stake, made for compute. Decentralize
        our every day applications and run them on blockchain.
      </Paragraph1>
    </Slide>
  )
}

const rows = [
  { completed: true, quarter: 'q4 2017', tasks: ['Whitepaper'] },
  { completed: true, quarter: 'q1 2018', tasks: ['First prototype 300 nodes'] },
  {
    completed: true,
    quarter: 'q2 2018',
    tasks: ['Blockchain integration', 'Alpha release 5000 nodes'],
  },
  {
    active: true,
    quarter: 'q3 2018',
    tasks: ['Early preview', 'Open for enterprise accounts'],
  },
  { quarter: 'q4 2018', tasks: ['Testnet launch', 'Public release'] },
  { quarter: 'q1 2019', tasks: ['Mainnet launch'] },
  { quarter: 'q2 2019', tasks: ['Decentralized app deployment'] },
]

export const RoadmapSlideAll = () => {
  return (
    <Slide>
      <table>
        <tbody>{rows.map((row, i) => <TR key={i} row={row} />)}</tbody>
      </table>
    </Slide>
  )
}

export const RoadmapSlideFinished = () => {
  const rows_ = rows.filter(row => row.completed)
  return (
    <Slide style={{ transform: 'translateX(-55%)' }}>
      <table>
        <tbody>{rows_.map((row, i) => <TR key={i} row={row} />)}</tbody>
      </table>
    </Slide>
  )
}

export const RoadmapSlideRemaining = () => {
  const rows_ = rows.filter(row => !row.completed)
  return (
    <Slide style={{ transform: 'translateX(55%)' }}>
      <table>
        <tbody>{rows_.map((row, i) => <TR key={i} row={row} />)}</tbody>
      </table>
    </Slide>
  )
}

const TR = ({ row }) => {
  return (
    <Row className={row.completed ? 'completed' : row.active ? 'active' : ''}>
      <td>
        <Quarter>{row.quarter}</Quarter>
      </td>
      <td>
        {row.tasks.map((task, i) => <Task key={i}>{task}</Task>)}
        {row.completed && <Task className="completed">completed</Task>}
        {row.active && <Task className="completed">in progress</Task>}
      </td>
    </Row>
  )
}

TR.propTypes = { row: PropTypes.object }

export default RoadmapSlide
