import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'rebass'

import { LineNr, Source, You, NodeLogos } from './Boxes'

const ResultWindowLogs = ({ logs, platforms }) => {
  return (
    <table>
      <tbody>
        {logs.map((log, i) => {
          const NodeLogo = NodeLogos[platforms[i]]
          return (
            <tr key={i}>
              <td style={{ paddingRight: '0.5rem' }}>
                <LineNr>{i + 1}:</LineNr>
              </td>
              <td style={{ paddingRight: '0.5rem' }}>
                <Text color="white" fontSize={0}>
                  {log}
                </Text>
              </td>
              <td>{!!NodeLogo && <NodeLogo />}</td>
              <td>
                {i === 0 && (
                  <Source> 👈 the node that has run your function</Source>
                )}
                {i === logs.length - 1 && <You> 👈 your browser</You>}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

ResultWindowLogs.propTypes = {
  logs: PropTypes.array,
  platforms: PropTypes.array,
}

export default ResultWindowLogs
