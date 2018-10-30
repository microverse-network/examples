import React from 'react'
import { Flex } from 'rebass'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { tomorrow } from 'react-syntax-highlighter/styles/prism'
import { Tooltip } from 'react-tippy'

import { H2, TooltipInner } from '../Boxes'
import { Slide, Code, Button, CodeParagraph } from './SlideBoxes'

const deployCode = `// import \`random\` as a microservice
// by using \`microverse!\` prefix
import random from 'microverse!lodash/random'

const random = random().then(res => {
  console.log(res)
  // Outputs: hello world from another peer
})
`

const DeployCodeSlide = () => {
  return (
    <Slide>
      <Flex>
        <div>
          <H2>
            <Code>npm install microverse-core</Code>
          </H2>
          <CodeParagraph>
            <SyntaxHighlighter
              language="javascript"
              style={tomorrow}
              customStyle={{
                background: '#ffffff09',
                margin: 0,
                fontSize: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              {deployCode}
            </SyntaxHighlighter>
          </CodeParagraph>
          <Tooltip
            theme="light"
            position="top"
            html={
              <TooltipInner style={{ textShadow: 'none' }}>
                Coming soon…
              </TooltipInner>
            }
          >
            <Button>Documentation</Button>
          </Tooltip>
        </div>
      </Flex>
    </Slide>
  )
}

export default DeployCodeSlide
