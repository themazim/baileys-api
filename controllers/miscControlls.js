import {
    updateProfileStatus,
    updateProfileName,
    getSession,
    getProfilePicture,
    formatPhone,
    formatGroup,
    profilePicture,
    blockAndUnblockUser,
} from './../whatsapp.js'
import response from './../response.js'

const setProfileStatus = async (req, res) => {
    try {
        const session = getSession(res.locals.sessionId)
        const responseData = await updateProfileStatus(session, req.body.status)
        response(res, 200, true, 'The status has been updated successfully', responseData)
    } catch (error) {
        response(res, 500, false, 'Failed to update status', error)
    }
}

const setProfileName = async (req, res) => {
    try {
        const session = getSession(res.locals.sessionId)
        const responseData = await updateProfileName(session, req.body.name)
        response(res, 200, true, 'The name has been updated successfully', responseData)
    } catch (error) {
        response(res, 500, false, 'Failed to update name', error)
    }
}

const setProfilePicture = async (req, res) => {
    try {
        const session = getSession(res.locals.sessionId)
        const { url } = req.body
        session.user.phone = session.user.id.split(':')[0].split('@')[0]
        const responseData = await profilePicture(session, session.user.phone + '@s.whatsapp.net', url)
        response(res, 200, true, 'Update profile picture successfully.', responseData)
    } catch (error) {
        response(res, 500, false, 'Failed Update profile picture.', error)
    }
}

const getProfile = async (req, res) => {
    try {
        const session = getSession(res.locals.sessionId)

        session.user.phone = session.user.id.split(':')[0].split('@')[0]
        session.user.image = await session.profilePictureUrl(session.user.id, 'image')
        session.user.status = await session.fetchStatus(session.user.phone + '@s.whatsapp.net')

        response(res, 200, true, 'The information has been obtained successfully.', session.user)
    } catch (error) {
        response(res, 500, false, 'Could not get the information', error)
    }
}

const getProfilePictureUser = async (req, res) => {
    try {
        const session = getSession(res.locals.sessionId)
        const isGroup = req.body.isGroup ?? false
        const jid = isGroup ? formatGroup(req.body.jid) : formatPhone(req.body.jid)

        const imagen = await getProfilePicture(session, jid, 'image')
        response(res, 200, true, 'The image has been obtained successfully.', imagen)
    } catch (error) {
        if (error === null) {
            return response(res, 404, false, 'the user or group not have image')
        }

        response(res, 500, false, 'Could not get the information', error)
    }
}

const blockAndUnblockContact = async (req, res) => {
    try {
        const session = getSession(res.locals.sessionId)
        const { jid, isBlock } = req.body
        const jidFormat = formatPhone(jid)
        const blockFormat = isBlock === true ? 'block' : 'unblock'
        const responseData = await blockAndUnblockUser(session, jidFormat, blockFormat)
        response(res, 200, true, 'The contact has been blocked or unblocked successfully', responseData)
    } catch (error) {
        response(res, 500, false, 'Failed to block or unblock contact', error)
    }
}

export {
    setProfileStatus,
    setProfileName,
    setProfilePicture,
    getProfile,
    getProfilePictureUser,
    blockAndUnblockContact,
}
