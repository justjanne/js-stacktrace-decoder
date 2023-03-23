import {decodeStacktraceEntry, parseStacktraceEntry} from "./decodeStacktrace";

/*
TypeError: Cannot read properties of null (reading 'getMyMembership')
    at https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3155923
    at https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3156309
    at Bl (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3525255)
    at t.unstable_runWithPriority (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3548936)
    at $i (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3465905)
    at Ml (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3524718)
    at vl (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3516246)
    at https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3466128
    at t.unstable_runWithPriority (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3548936)
    at $i (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3465905)
 */

/*
Error: OLM.BAD_MESSAGE_MAC
    at https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3415015
    at Ne.<anonymous> (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3420434)
    at Ne.ed25519_verify (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3414245)
    at https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:2756167
    at u.getUtility (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:2745164)
    at u.verifySignature (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:2756141)
    at v (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:763210)
    at _.isKeyBackupTrusted (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:2795889)
    at async _.checkAndStart (https://app.element.io/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:2793654)
 */

/*
2023-02-02T11:33:35.409Z E l is undefined
$d@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~element-web-app.js:2:748063
sa@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3479995
Ws@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3532076
Ol@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3519351
Dl@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3519279
Fl@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3519140
vl@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3516127
Yi/<@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3465914
t.unstable_runWithPriority@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3548722
$i@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3465691
Yi@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3465861
Wi@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3465794
Ne@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3536596
Qt@https://element.hu-berlin.de/bundles/f951c5491b9e2e16e4eb/vendors~init.js:2:3444451
 */

/*
    at d (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:10559)
    at s.addListener (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:13143)
    at E.on (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:449090)
    at a.reEmit (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:1064042)
    at a.reEmit (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:1064266)
    at g.setThread (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:201668)
    at E.setEventMetadata (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:484964)
    at E.processEvent (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:482482)
    at E.processRootEvent (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:483368)
    at E.updateThreadMetadata (vector://vector/webapp/bundles/799c15368d34387db341/vendors~init.js:2:483888)
 */

describe("decodeStacktrace", () => {
    it("to parse regular lines correctly", () => {
        expect(parseStacktraceEntry(""))
    })
})
