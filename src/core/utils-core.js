///
/// Class: UtilsCore
///
/// Reduced subset of Utils, used exclusively in gpu-core.js
///
/// Various utility functions / snippets of code that GPU.JS uses internally.\
/// This covers various snippets of code that is not entirely gpu.js specific (ie. may find uses elsewhere)
///
/// Note that all methods in this class is 'static' by nature `UtilsCore.functionName()`
///
class UtilsCore {

	//-----------------------------------------------------------------------------
	//
	//  Canvas validation and support
	//
	//-----------------------------------------------------------------------------

	///
	/// Function: isCanvas
	///
	/// Return TRUE, on a valid DOM canvas object
	///
	/// Note: This does just a VERY simply sanity check. And may give false positives.
	///
	/// Parameters:
	/// 	canvasObj - {Canvas DOM object} Object to validate
	///
	/// Returns:
	/// 	{Boolean} TRUE if the object is a DOM canvas
	///
	static isCanvas(canvasObj) {
		return (
			canvasObj !== null &&
			canvasObj.nodeName &&
			canvasObj.getContext &&
			canvasObj.nodeName.toUpperCase() === 'CANVAS'
		);
	}

	///
	/// Function: isCanvasSupported
	///
	/// Return TRUE, if browser supports canvas
	///
	/// Returns:
	/// 	{Boolean} TRUE if browser supports canvas
	///
	static get isCanvasSupported() {
		return _isCanvasSupported;
	}

	///
	/// Function: initCanvas
	///
	/// Initiate and returns a canvas, for usage in init_webgl.
	/// Returns only if canvas is supported by browser.
	///
	/// Returns:
	/// 	{Canvas DOM object} Canvas dom object if supported by browser, else null
	///
	static initCanvas() {
		// Fail fast if browser previously detected no support
		if (!_isCanvasSupported) {
			return null;
		}

		// Create a new canvas DOM
		const canvas = document.createElement('canvas');

		// Default width and height, to fix webgl issue in safari
		canvas.width = 2;
		canvas.height = 2;

		// Returns the canvas
		return canvas;
	}

	//-----------------------------------------------------------------------------
	//
	//  Webgl validation and support
	//
	//-----------------------------------------------------------------------------

	///
	/// Function: isWebGl
	///
	/// Return TRUE, on a valid webGl context object
	///
	/// Note: This does just a VERY simply sanity check. And may give false positives.
	///
	/// Parameters:
	/// 	webGlObj - {webGl context} Object to validate
	///
	/// Returns:
	/// 	{Boolean} TRUE if the object is a webgl context object
	///
	static isWebGl(webGlObj) {
		return (
			webGlObj !== null &&
			(
				(
					webGlObj.__proto__ &&
					webGlObj.__proto__.hasOwnProperty('getExtension')
				) ||
				(
					webGlObj.prototype &&
					webGlObj.prototype.hasOwnProperty('getExtension')
				)
			)
		);
	}

	///
	/// Function: isWebGlSupported
	///
	/// Return TRUE, if browser supports webgl
	///
	/// Returns:
	/// 	{Boolean} TRUE if browser supports webgl
	///
	static get isWebGlSupported() {
		return _isWebGlSupported;
	}

	static get isWebGlDrawBuffersSupported() {
		return _isWebGlDrawBuffersSupported;
	}

	// Default webgl options to use
	static get initWebGlDefaultOptions() {
		return {
			alpha: false,
			depth: false,
			antialias: false
		};
	}

	///
	/// Function: initWebGl
	///
	/// Initiate and returns a webGl, from a canvas object
	/// Returns only if webGl is supported by browser.
	///
	/// Parameters:
	/// 	canvasObj - {Canvas DOM object} Object to validate
	///
	/// Returns:
	/// 	{Canvas DOM object} Canvas dom object if supported by browser, else null
	///
	static initWebGl(canvasObj) {

		// First time setup, does the browser support check memorizer
		if (typeof isCanvasSupported !== 'undefined' && typeof isWebGlSupported !== 'undefined' || canvasObj === null) {
			if (!isCanvasSupported || !isWebGlSupported) {
				return null;
			}
		}

		// Fail fast for invalid canvas object
		if (!UtilsCore.isCanvas(canvasObj)) {
			throw new Error('Invalid canvas object - ' + canvasObj);
		}

		// Create a new canvas DOM
		const webGl = (
			canvasObj.getContext('experimental-webgl', UtilsCore.initWebGlDefaultOptions) ||
			canvasObj.getContext('webgl', UtilsCore.initWebGlDefaultOptions)
		);

		// Get the extension that is needed
		webGl.OES_texture_float        = webGl.getExtension('OES_texture_float');
		webGl.OES_texture_float_linear = webGl.getExtension('OES_texture_float_linear');
		webGl.OES_element_index_uint   = webGl.getExtension('OES_element_index_uint');

		// Returns the canvas
		return webGl;
	}

}

//-----------------------------------------------------------------------------
//
//  Canvas & Webgl validation and support constants
//
//-----------------------------------------------------------------------------

const _isCanvasSupported = typeof document !== 'undefined' ? UtilsCore.isCanvas(document.createElement('canvas')) : false;
const _testingWebGl = UtilsCore.initWebGl(UtilsCore.initCanvas());
const _isWebGlSupported = UtilsCore.isWebGl(_testingWebGl);
const _isWebGlDrawBuffersSupported = Boolean(_testingWebGl.getExtension('WEBGL_draw_buffers'));

UtilsCore.OES_texture_float         = _testingWebGl.OES_texture_float;
UtilsCore.OES_texture_float_linear  = _testingWebGl.OES_texture_float_linear;
UtilsCore.OES_element_index_uint    = _testingWebGl.OES_element_index_uint;

module.exports = UtilsCore;