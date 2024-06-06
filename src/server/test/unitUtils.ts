import * as chai from 'chai'
import * as promisedChai from 'chai-as-promised'
import * as chaiDateTime from 'chai-datetime'
import * as stringChai from 'chai-string'
// import * as deepEqualInAnyOrder from 'deep-equal-in-any-order'
import * as dirtyChai from 'dirty-chai'
import * as sinonChai from 'sinon-chai'

chai.use(dirtyChai)
chai.use(sinonChai)
chai.use(promisedChai)
chai.use(chaiDateTime)
chai.use(stringChai)
// chai.use(deepEqualInAnyOrder)
export const expect = chai.expect