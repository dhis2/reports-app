import { TextEncoder } from 'util'
import Adapter from '@cfaester/enzyme-adapter-react-18'
import { configure } from 'enzyme'

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder
}

configure({ adapter: new Adapter() })
