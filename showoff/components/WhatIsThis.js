import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Code, Absolute, Box, Image } from 'rebass'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { tomorrow } from 'react-syntax-highlighter/styles/prism'

import styles from './WhatIsThis.css'
import Button from './GradientButton'

const Overlay = Absolute.extend`
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #00000099;
  width: 100vw;
  height: 100vh;
`

const Modal = Box.extend`
  background: pink;
  width: 62.5vw;
  max-width: 800px;
  max-height: 62.5vh;
  flex: 1 1 auto;
  background: #20252fbb;
  border: 1px solid #ffffff16;
  padding: 2rem;
  overflow: auto;
`

const Logo = Image.extend`
  width: 96px;
  height: 96px;
  display: block;
  margin: 4rem auto 2rem;
`

const Heading1 = Box.extend`
  font-size: 1.625rem;
  font-weight: 300;
  text-align: center;
  margin-bottom: 1rem;
`

const Heading2 = Box.extend`
  font-size: 1.25rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: #ffffff99;
  border-bottom: 1px dashed #ffffff11;
  display: inline-block;
`

const LinkButton = Button.extend`
  min-width: 140px;
`
const deployCode = `import microverse from 'microverse'
import _ from 'microverse!lodash'

microverse.ready(async () => {
  microverse.register(_)
  const random = await _.random()
  console.log(random)
})
`

export default class WhatIsThis extends Component {
  static propTypes = {
    cancel: PropTypes.func.isRequired,
  }

  cancel = () => this.props.cancel()

  stopCancel = event => event.stopPropagation()

  render() {
    return (
      <Overlay onClick={this.cancel}>
        <Logo src="/assets/logos/logo-192x192.png" />
        <Heading1>This is Microverse</Heading1>
        <Modal className={styles.modal} onClick={this.stopCancel}>
          <p style={{ fontSize: '1.5rem' }}>
            This is a global, open source, peer-to-peer decentralized
            application network that anyone can host an app or store data or
            deploy microservices.
          </p>
          <ul pl="1rem" pr="1rem">
            <li>
              Every dot you see in the screen is either a browser or a server we
              call them a node
            </li>
            <li>Every node is at least connected to another node via p2p</li>
            <li>You can deploy apps to the nodes</li>
            <li>
              Dependencies of the deployed apps are distributed among nodes
            </li>
            <li>
              These nodes constitute a p2p db, and all of them have access to
              this db
            </li>
            <li>
              You can query this db from a url with a mongo query language like
              language
            </li>
            <li>
              If a node handles a request, network sends a predefined amount of
              MCH to the owners wallet address.
            </li>
            <li>
              Anyone can join the network by running the{' '}
              <Code>micro agent</Code> on their computers or installing a chrome
              extension
            </li>
            <li>
              Microverse has a webpack loader too, if your app is using webpack
              with a very little effort you can run your app on the Microverse
              network.
            </li>
          </ul>

          <Heading2>Deployment</Heading2>
          <p>
            Sentient 3D-printed otaku pen convenience store tube numinous j-pop
            systemic stimulate. Fluidity towards courier range-rover disposable
            DIY RAF cyber-free-market carbon uplink.
          </p>
          <SyntaxHighlighter
            showLineNumbers
            language="javascript"
            style={tomorrow}
            customStyle={{
              background: 'transparent',
              margin: 0,
              padding: 0,
              fontSize: '0.875rem',
            }}
            lineNumberStyle={{
              color: '#ffffff11',
              fontSize: '0.875rem',
            }}
          >
            {deployCode}
          </SyntaxHighlighter>
          <p>
            Tank-traps claymore mine convenience store face forwards fluidity
            narrative towards j-pop apophenia free-market pen silent rain
            render-farm human decay math. Wristwatch media office into San
            Francisco concrete knife man chrome. Artisanal girl media urban
            claymore mine industrial grade drone human pen. Garage semiotics
            tanto uplink voodoo god car plastic numinous network advert. You can
            deploy your apps to.
          </p>
          <Heading2>Storage/DB/Sharding</Heading2>
          <p>
            Shrine bomb weathered kanji tiger-team youtube sprawl augmented
            reality fluidity claymore mine warehouse dome apophenia saturation
            point nodality BASE jump range-rover. Beef noodles drugs nodal point
            bicycle dead network numinous. J-pop RAF hotdog human bridge grenade
            free-market range-rover.{' '}
          </p>
          <Heading2>Local Development</Heading2>
          <p>
            Physical geodesic Tokyo chrome cartel hacker systemic. Skyscraper
            long-chain hydrocarbons order-flow corporation vehicle bicycle
            dolphin industrial grade lights urban post-into-ware computer
            cardboard.
          </p>
          <p>
            Rifle faded disposable singularity soul-delay realism car marketing
            nano. Voodoo god Chiba Legba face forwards computer construct
            dolphin boat-ware. A.I. soul-delay into nodality convenience store
            geodesic corporation euro-pop. Wonton soup cardboard drone city BASE
            jump beef noodles franchise towards footage singularity pen
            corporation assassin.
          </p>
          <Heading2>Webpack Loaders</Heading2>
          <p>
            Drone free-market augmented reality sign dome disposable drugs pen
            refrigerator garage fetishism Kowloon tattoo cardboard
            crypto-saturation point towards.
          </p>
          <Heading2>Blockchain</Heading2>
          <p>
            Denim pistol dolphin alcohol katana vehicle systema gang neural
            claymore mine. Man advert franchise bicycle dead assassin lights.
            Corporation katana Shibuya shoes physical A.I. DIY soul-delay
            apophenia.
          </p>
          <Heading2>Microverse Coin (MCH)</Heading2>
          <p>
            Neural shoes Chiba rebar office tank-traps nodality cartel.
            Monofilament office sensory Shibuya industrial grade jeans ablative
            hotdog network spook drone.
          </p>
        </Modal>
        <Box style={{ margin: '2rem 0' }}>
          <LinkButton>GitHub</LinkButton>
          <LinkButton ml={3}>Documentation</LinkButton>
        </Box>
      </Overlay>
    )
  }
}

// <Flex justifyContent="space-around">
//   <Box style={{ fontSize: '1.25rem', width: '45%' }}>
//     <Heading3>Deploy your app</Heading3>
//     The compute power is made of the nodes that are deployed by anyone
//     around the globe. It can be a smartphone or a data center full of
//     servers.
//   </Box>
//   <Box style={{ fontSize: '1.25rem', width: '45%' }}>
//     <Heading3>Earn money</Heading3>
//     You can join the Microverse network and make money for the compute
//     power or storage you provide. When someone starts using your nodes
//     you will be paid in Microverse Coin.
//   </Box>
// </Flex>
