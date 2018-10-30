import React from 'react'
import PropTypes from 'prop-types'
import { Circle, Rectangle } from 'pixi.js'
import { Container, Text } from 'react-pixi-fiber'

import Star from './Circle'
import Datasets from './Datasets'
import StarInfoBox from './StarInfoBox'
// import random from '../utils/random'

export default class Stars extends React.Component {
  static propTypes = {
    fill: PropTypes.number,
    opacity: PropTypes.number,
    nodes: PropTypes.array,
    scale: PropTypes.object,
    myPeerId: PropTypes.string,
  }

  static defaultProps = {
    opacity: 1,
    fill: 0xffffff,
  }

  state = {
    selected: null,
  }

  select = id => {
    const { selected } = this.state
    const state = selected === id ? { selected: null } : { selected: id }
    this.setState(state)
  }

  onStarClick = id => () => this.select(id)

  render() {
    const { nodes, myPeerId, fill, scale, opacity } = this.props
    const { selected } = this.state

    if (!nodes) return null

    const selectedNode = nodes.find(n => n.id === selected)

    return (
      <Container name="stars">
        {nodes.map(node => {
          const { id, x, y, z, datasets = [] } = node
          if (!id) return null
          const radius = Math.max(0.2, 2.5 + z / 100)
          // const radius = random(1, 4)
          // const radius = Math.max(0.2, 2.5 + x / 100)
          // const radius = 2.5
          const skale = { x: 1 / scale.x, y: 1 / scale.y }
          const shouldPutDatasets = datasets.length && scale.x >= 1
          let hitArea
          if (selected === id) {
            hitArea = new Rectangle(
              x + 10 / scale.x,
              y - 170 / scale.y,
              300 / scale.x,
              170 / scale.y,
            )
          } else {
            hitArea = new Circle(x, y, Math.max(radius, 30 / scale.x))
          }

          return (
            <Container
              buttonMode
              interactive
              name={`star-${id}`}
              key={id}
              click={this.onStarClick(id)}
              hitArea={hitArea}
            >
              {id === myPeerId && (
                <Text
                  x={x}
                  y={y - 30 / scale.x}
                  text="You are here"
                  scale={skale}
                  anchor={[0.5, 0.5]}
                  style={{ fontSize: 12, fill }}
                />
              )}
              <Star
                // fake={node.isFake}
                x={x}
                y={y}
                z={z}
                fill={fill}
                opacity={opacity}
                radius={radius}
              />
              {!!shouldPutDatasets && (
                <Datasets datasets={datasets} scale={scale} x={x} y={y} z={z} />
              )}
            </Container>
          )
        })}
        {selectedNode && (
          <StarInfoBox
            x={selectedNode.x + 10 / scale.x}
            y={selectedNode.y - 30 / scale.y}
            z={selectedNode.z}
            scale={scale}
            node={selectedNode}
            click={this.select}
          />
        )}
      </Container>
    )
  }
}
