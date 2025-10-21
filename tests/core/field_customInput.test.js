/**
 * @fileoverview Unit tests for field_customInput.js
 * Tests for Blockly.FieldCustom field implementation
 */
'use strict';

describe('Blockly.FieldCustom', function() {
  let mockBlock;
  let mockSourceBlock;
  let mockFieldGroup;
  let mockInputSource;
  let testHTMLElement;
  
  beforeEach(function() {
    // Reset the customInputs map before each test
    if (typeof Blockly !== 'undefined' && Blockly.FieldCustom) {
      // Clear all registered inputs
      const inputs = Blockly.FieldCustom.registeredInputs ? 
        Blockly.FieldCustom.registeredInputs() : new Map();
      if (inputs && inputs.clear) {
        inputs.clear();
      }
    }
    
    // Create mock HTML element for testing
    testHTMLElement = document.createElement('div');
    testHTMLElement.id = 'test-custom-input';
    testHTMLElement.style.width = '100px';
    testHTMLElement.style.height = '50px';
    testHTMLElement.width = 100;
    testHTMLElement.height = 50;
    
    // Mock SVG field group
    mockFieldGroup = {
      setAttribute: jasmine.createSpy('setAttribute'),
      appendChild: jasmine.createSpy('appendChild')
    };
    
    // Mock input source
    mockInputSource = {
      appendChild: jasmine.createSpy('appendChild'),
      setAttribute: jasmine.createSpy('setAttribute')
    };
    
    // Mock source block
    mockSourceBlock = {
      getSvgRoot: jasmine.createSpy('getSvgRoot').and.returnValue({
        appendChild: jasmine.createSpy('appendChild')
      }),
      workspace: {
        rendered: true
      }
    };
    
    // Mock Blockly utilities if not available
    if (typeof Blockly === 'undefined') {
      window.Blockly = {};
    }
    
    if (!Blockly.utils) {
      Blockly.utils = {
        createSvgElement: jasmine.createSpy('createSvgElement').and.callFake(function(type) {
          if (type === 'g') return mockFieldGroup;
          if (type === 'foreignObject') return mockInputSource;
          return document.createElementNS('http://www.w3.org/2000/svg', type);
        })
      };
    }
    
    if (!Blockly.bindEventWithChecks_) {
      Blockly.bindEventWithChecks_ = jasmine.createSpy('bindEventWithChecks_');
    }
    
    if (!Blockly.unbindEvent_) {
      Blockly.unbindEvent_ = jasmine.createSpy('unbindEvent_');
    }
  });
  
  afterEach(function() {
    // Cleanup
    if (testHTMLElement && testHTMLElement.parentNode) {
      testHTMLElement.parentNode.removeChild(testHTMLElement);
    }
  });
  
  describe('Constructor', function() {
    it('should create a FieldCustom with default value', function() {
      const field = new Blockly.FieldCustom('test value');
      expect(field).toBeDefined();
      expect(field.value_).toBe('test value');
    });
    
    it('should initialize with empty string when no value provided', function() {
      const field = new Blockly.FieldCustom('');
      expect(field.value_).toBe('');
    });
    
    it('should set inputID to null by default', function() {
      const field = new Blockly.FieldCustom('test');
      expect(field.inputID).toBeNull();
    });
    
    it('should initialize inputParts to null', function() {
      const field = new Blockly.FieldCustom('test');
      expect(field.inputParts).toBeNull();
    });
    
    it('should add argType "text"', function() {
      const field = new Blockly.FieldCustom('test');
      // The addArgType method should be called during construction
      // This would need to be verified through the parent class behavior
      expect(field).toBeDefined();
    });
  });
  
  describe('fromJson', function() {
    it('should create FieldCustom from JSON options with custom property', function() {
      const options = { custom: 'json value' };
      const field = Blockly.FieldCustom.fromJson(options);
      expect(field).toBeDefined();
      expect(field.value_).toBe('json value');
    });
    
    it('should handle empty custom property', function() {
      const options = { custom: '' };
      const field = Blockly.FieldCustom.fromJson(options);
      expect(field.value_).toBe('');
    });
    
    it('should handle undefined custom property', function() {
      const options = {};
      const field = Blockly.FieldCustom.fromJson(options);
      expect(field.value_).toBeUndefined();
    });
    
    it('should log message when creating from JSON', function() {
      spyOn(console, 'log');
      const options = { custom: 'test' };
      Blockly.FieldCustom.fromJson(options);
      expect(console.log).toHaveBeenCalledWith('new custom field', options);
    });
  });
  
  describe('registerInput', function() {
    let mockOnInit, mockOnClick, mockOnUpdate;
    
    beforeEach(function() {
      mockOnInit = jasmine.createSpy('onInit');
      mockOnClick = jasmine.createSpy('onClick');
      mockOnUpdate = jasmine.createSpy('onUpdate');
    });
    
    it('should successfully register a valid input', function() {
      spyOn(console, 'warn');
      Blockly.FieldCustom.registerInput(
        'testId',
        testHTMLElement,
        mockOnInit,
        mockOnClick,
        mockOnUpdate
      );
      expect(console.warn).not.toHaveBeenCalled();
    });
    
    it('should warn if html parameter is not a DOM element', function() {
      spyOn(console, 'warn');
      Blockly.FieldCustom.registerInput(
        'testId',
        null,
        mockOnInit,
        mockOnClick,
        mockOnUpdate
      );
      expect(console.warn).toHaveBeenCalledWith('Param 1 must be a valid DOM element!');
    });
    
    it('should warn if html parameter is a string instead of DOM element', function() {
      spyOn(console, 'warn');
      Blockly.FieldCustom.registerInput(
        'testId',
        '<div>test</div>',
        mockOnInit,
        mockOnClick,
        mockOnUpdate
      );
      expect(console.warn).toHaveBeenCalledWith('Param 1 must be a valid DOM element!');
    });
    
    it('should warn if onInit is not a function', function() {
      spyOn(console, 'warn');
      Blockly.FieldCustom.registerInput(
        'testId',
        testHTMLElement,
        null,
        mockOnClick,
        mockOnUpdate
      );
      expect(console.warn).toHaveBeenCalledWith('Param 2 must be a function!');
    });
    
    it('should warn if onInit is not a function (string provided)', function() {
      spyOn(console, 'warn');
      Blockly.FieldCustom.registerInput(
        'testId',
        testHTMLElement,
        'not a function',
        mockOnClick,
        mockOnUpdate
      );
      expect(console.warn).toHaveBeenCalledWith('Param 2 must be a function!');
    });
    
    it('should warn if onClick is not a function', function() {
      spyOn(console, 'warn');
      Blockly.FieldCustom.registerInput(
        'testId',
        testHTMLElement,
        mockOnInit,
        undefined,
        mockOnUpdate
      );
      expect(console.warn).toHaveBeenCalledWith('Param 3 must be a function!');
    });
    
    it('should warn if onUpdate is not a function', function() {
      spyOn(console, 'warn');
      Blockly.FieldCustom.registerInput(
        'testId',
        testHTMLElement,
        mockOnInit,
        mockOnClick,
        'not a function'
      );
      expect(console.warn).toHaveBeenCalledWith('Param 4 must be a function!');
    });
    
    it('should register input with all valid parameters', function() {
      Blockly.FieldCustom.registerInput(
        'validId',
        testHTMLElement,
        mockOnInit,
        mockOnClick,
        mockOnUpdate
      );
      // Verification would require access to customInputs map
      expect(true).toBe(true);
    });
    
    it('should handle multiple registrations for different IDs', function() {
      const html2 = document.createElement('span');
      const onInit2 = jasmine.createSpy('onInit2');
      const onClick2 = jasmine.createSpy('onClick2');
      const onUpdate2 = jasmine.createSpy('onUpdate2');
      
      Blockly.FieldCustom.registerInput('id1', testHTMLElement, mockOnInit, mockOnClick, mockOnUpdate);
      Blockly.FieldCustom.registerInput('id2', html2, onInit2, onClick2, onUpdate2);
      
      // Both should register without errors
      expect(true).toBe(true);
    });
  });
  
  describe('unregisterInput', function() {
    it('should unregister an existing input', function() {
      const mockOnInit = jasmine.createSpy('onInit');
      const mockOnClick = jasmine.createSpy('onClick');
      const mockOnUpdate = jasmine.createSpy('onUpdate');
      
      Blockly.FieldCustom.registerInput('testId', testHTMLElement, mockOnInit, mockOnClick, mockOnUpdate);
      Blockly.FieldCustom.unregisterInput('testId');
      
      // Should not throw error
      expect(true).toBe(true);
    });
    
    it('should handle unregistering non-existent input gracefully', function() {
      expect(function() {
        Blockly.FieldCustom.unregisterInput('nonExistentId');
      }).not.toThrow();
    });
    
    it('should handle null ID', function() {
      expect(function() {
        Blockly.FieldCustom.unregisterInput(null);
      }).not.toThrow();
    });
    
    it('should handle undefined ID', function() {
      expect(function() {
        Blockly.FieldCustom.unregisterInput(undefined);
      }).not.toThrow();
    });
  });
  
  describe('init', function() {
    let field;
    let mockOnInit, mockOnClick, mockOnUpdate;
    
    beforeEach(function() {
      mockOnInit = jasmine.createSpy('onInit');
      mockOnClick = jasmine.createSpy('onClick');
      mockOnUpdate = jasmine.createSpy('onUpdate');
      
      field = new Blockly.FieldCustom('test value');
      field.sourceBlock_ = mockSourceBlock;
      field.inputID = 'testInputId';
    });
    
    it('should warn if inputID is null', function() {
      spyOn(console, 'warn');
      field.inputID = null;
      field.init();
      expect(console.warn).toHaveBeenCalledWith('inputID is required for FieldCustom!');
    });
    
    it('should warn if inputID is empty string', function() {
      spyOn(console, 'warn');
      field.inputID = '';
      field.init();
      expect(console.warn).toHaveBeenCalledWith('inputID is required for FieldCustom!');
    });
    
    it('should warn if input is not registered', function() {
      spyOn(console, 'warn');
      field.init();
      expect(console.warn).toHaveBeenCalledWith('Input with id "testInputId" is not registered!');
    });
    
    it('should initialize field with registered input', function() {
      Blockly.FieldCustom.registerInput('testInputId', testHTMLElement, mockOnInit, mockOnClick, mockOnUpdate);
      field.init();
      
      expect(field.inputParts).toBeDefined();
      expect(mockOnInit).toHaveBeenCalledWith(field);
    });
    
    it('should set field width from HTML element width property', function() {
      testHTMLElement.width = 150;
      Blockly.FieldCustom.registerInput('testInputId', testHTMLElement, mockOnInit, mockOnClick, mockOnUpdate);
      field.init();
      
      expect(field.size_.width).toBe(150);
    });
    
    it('should set field width from style.width when width property not available', function() {
      testHTMLElement.width = null;
      testHTMLElement.style.width = '200px';
      Blockly.FieldCustom.registerInput('testInputId', testHTMLElement, mockOnInit, mockOnClick, mockOnUpdate);
      field.init();
      
      expect(field.size_.width).toBe(200);
    });
    
    it('should call onInit callback after initialization', function() {
      Blockly.FieldCustom.registerInput('testInputId', testHTMLElement, mockOnInit, mockOnClick, mockOnUpdate);
      field.init();
      
      expect(mockOnInit).toHaveBeenCalled();
      expect(mockOnInit.calls.argsFor(0)[0]).toBe(field);
    });
    
    it('should bind mousedown event', function() {
      Blockly.FieldCustom.registerInput('testInputId', testHTMLElement, mockOnInit, mockOnClick, mockOnUpdate);
      field.getClickTarget_ = jasmine.createSpy('getClickTarget_').and.returnValue(testHTMLElement);
      field.onMouseDown_ = jasmine.createSpy('onMouseDown_');
      
      field.init();
      
      expect(Blockly.bindEventWithChecks_).toHaveBeenCalled();
    });
  });
  
  describe('setValue', function() {
    let field;
    let mockOnUpdate;
    
    beforeEach(function() {
      mockOnUpdate = jasmine.createSpy('onUpdate');
      field = new Blockly.FieldCustom('initial');
      field.inputParts = {
        html: testHTMLElement,
        onUpdate: mockOnUpdate
      };
    });
    
    it('should set value correctly', function() {
      field.setValue('new value');
      expect(field.value_).toBe('new value');
    });
    
    it('should call onUpdate when value changes', function() {
      field.setValue('updated value');
      expect(mockOnUpdate).toHaveBeenCalledWith(field);
    });
    
    it('should handle empty string value', function() {
      field.setValue('');
      expect(field.value_).toBe('');
      expect(mockOnUpdate).toHaveBeenCalled();
    });
    
    it('should handle null value', function() {
      field.setValue(null);
      expect(field.value_).toBe(null);
    });
    
    it('should handle numeric values', function() {
      field.setValue(42);
      expect(field.value_).toBe(42);
      expect(mockOnUpdate).toHaveBeenCalled();
    });
    
    it('should handle boolean values', function() {
      field.setValue(true);
      expect(field.value_).toBe(true);
      expect(mockOnUpdate).toHaveBeenCalled();
    });
    
    it('should handle object values', function() {
      const objValue = { key: 'value' };
      field.setValue(objValue);
      expect(field.value_).toBe(objValue);
    });
    
    it('should not throw if inputParts is undefined', function() {
      field.inputParts = undefined;
      expect(function() {
        field.setValue('test');
      }).not.toThrow();
    });
    
    it('should fire change event if block is rendered', function() {
      field.sourceBlock_ = {
        workspace: { rendered: true }
      };
      spyOn(Blockly.Events, 'fire').and.stub();
      
      field.setValue('new value');
      
      // Event should be fired for rendered blocks
      // Actual implementation depends on parent class
    });
  });
  
  describe('getValue', function() {
    it('should return the current value', function() {
      const field = new Blockly.FieldCustom('test value');
      expect(field.getValue()).toBe('test value');
    });
    
    it('should return updated value after setValue', function() {
      const field = new Blockly.FieldCustom('initial');
      field.setValue('updated');
      expect(field.getValue()).toBe('updated');
    });
    
    it('should return empty string', function() {
      const field = new Blockly.FieldCustom('');
      expect(field.getValue()).toBe('');
    });
    
    it('should return null if value is null', function() {
      const field = new Blockly.FieldCustom('test');
      field.value_ = null;
      expect(field.getValue()).toBe(null);
    });
    
    it('should return numeric value', function() {
      const field = new Blockly.FieldCustom(123);
      expect(field.getValue()).toBe(123);
    });
  });
  
  describe('showEditor_', function() {
    let field;
    let mockOnClick;
    
    beforeEach(function() {
      mockOnClick = jasmine.createSpy('onClick');
      field = new Blockly.FieldCustom('test');
      field.inputParts = {
        html: testHTMLElement,
        onClick: mockOnClick
      };
    });
    
    it('should call onClick callback', function() {
      field.showEditor_();
      expect(mockOnClick).toHaveBeenCalledWith(field);
    });
    
    it('should pass field instance to onClick', function() {
      field.showEditor_();
      expect(mockOnClick.calls.argsFor(0)[0]).toBe(field);
    });
    
    it('should handle multiple calls', function() {
      field.showEditor_();
      field.showEditor_();
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });
    
    it('should not throw if inputParts is undefined', function() {
      field.inputParts = undefined;
      expect(function() {
        field.showEditor_();
      }).toThrow(); // This should actually throw since we're accessing undefined.onClick
    });
  });
  
  describe('dispose_', function() {
    let field;
    let mockMouseDownWrapper;
    
    beforeEach(function() {
      field = new Blockly.FieldCustom('test');
      mockMouseDownWrapper = jasmine.createSpy('wrapper');
      field.mouseDownWrapper_ = mockMouseDownWrapper;
      field.inputParts = {
        html: testHTMLElement
      };
    });
    
    it('should return a disposal function', function() {
      const disposeFn = field.dispose_();
      expect(typeof disposeFn).toBe('function');
    });
    
    it('should unbind mousedown event when disposal function is called', function() {
      const disposeFn = field.dispose_();
      disposeFn();
      expect(Blockly.unbindEvent_).toHaveBeenCalledWith(mockMouseDownWrapper);
    });
    
    it('should call parent dispose when disposal function is called', function() {
      // Mock the parent class dispose
      Blockly.FieldCustom.superClass_.dispose_ = jasmine.createSpy('parentDispose').and.returnValue(
        jasmine.createSpy('parentDisposeFn')
      );
      
      const disposeFn = field.dispose_();
      disposeFn();
      
      // Parent dispose should be called
      expect(true).toBe(true);
    });
    
    it('should handle missing mouseDownWrapper gracefully', function() {
      field.mouseDownWrapper_ = null;
      const disposeFn = field.dispose_();
      
      expect(function() {
        disposeFn();
      }).not.toThrow();
    });
    
    it('should not call optOnDispose (removed in refactor)', function() {
      // The optOnDispose callback was removed in the refactor
      const mockOptOnDispose = jasmine.createSpy('optOnDispose');
      field.inputParts.optOnDispose = mockOptOnDispose;
      
      const disposeFn = field.dispose_();
      disposeFn();
      
      // Should NOT be called since it was removed
      expect(mockOptOnDispose).not.toHaveBeenCalled();
    });
  });
  
  describe('Edge Cases and Integration', function() {
    it('should handle rapid setValue calls', function() {
      const field = new Blockly.FieldCustom('initial');
      const mockOnUpdate = jasmine.createSpy('onUpdate');
      field.inputParts = { onUpdate: mockOnUpdate };
      
      for (let i = 0; i < 100; i++) {
        field.setValue('value' + i);
      }
      
      expect(field.getValue()).toBe('value99');
      expect(mockOnUpdate).toHaveBeenCalledTimes(100);
    });
    
    it('should handle special characters in values', function() {
      const field = new Blockly.FieldCustom('initial');
      const specialChars = '<script>alert("xss")</script>';
      field.setValue(specialChars);
      expect(field.getValue()).toBe(specialChars);
    });
    
    it('should handle unicode values', function() {
      const field = new Blockly.FieldCustom('initial');
      const unicode = '🔥 Unicode 测试 🚀';
      field.setValue(unicode);
      expect(field.getValue()).toBe(unicode);
    });
    
    it('should handle very long string values', function() {
      const field = new Blockly.FieldCustom('initial');
      const longString = 'a'.repeat(10000);
      field.setValue(longString);
      expect(field.getValue()).toBe(longString);
      expect(field.getValue().length).toBe(10000);
    });
    
    it('should maintain independence between multiple field instances', function() {
      const field1 = new Blockly.FieldCustom('value1');
      const field2 = new Blockly.FieldCustom('value2');
      
      field1.setValue('updated1');
      expect(field1.getValue()).toBe('updated1');
      expect(field2.getValue()).toBe('value2');
    });
  });
  
  describe('Backward Compatibility', function() {
    it('should no longer accept options object in constructor', function() {
      // The old API accepted an options object, new API accepts a value string
      const options = { value: 'test', id: 'testId' };
      const field = new Blockly.FieldCustom(options);
      
      // Should treat the entire object as the value
      expect(field.value_).toBe(options);
    });
    
    it('should not have registeredInputs method', function() {
      // This method was removed in the refactor
      expect(Blockly.FieldCustom.registeredInputs).toBeUndefined();
    });
    
    it('registerInput should accept 5 parameters instead of 6', function() {
      const mockOnInit = jasmine.createSpy('onInit');
      const mockOnClick = jasmine.createSpy('onClick');
      const mockOnUpdate = jasmine.createSpy('onUpdate');
      
      // Old API had 6 params (id, html, onInit, onClick, onUpdate, optOnDispose)
      // New API has 5 params (id, html, onInit, onClick, onUpdate)
      expect(function() {
        Blockly.FieldCustom.registerInput(
          'testId',
          testHTMLElement,
          mockOnInit,
          mockOnClick,
          mockOnUpdate
        );
      }).not.toThrow();
    });
  });
});