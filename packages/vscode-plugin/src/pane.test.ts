import * as pane from "./pane"
// @ponicode
describe("pane.getColumnFromPane", () => {
    test("0", () => {
        let callFunction: any = () => {
            pane.getColumnFromPane("One")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            pane.getColumnFromPane("Active")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            pane.getColumnFromPane("Two")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            pane.getColumnFromPane("Six")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            pane.getColumnFromPane("Three")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            pane.getColumnFromPane("")
        }
    
        expect(callFunction).not.toThrow()
    })
})
