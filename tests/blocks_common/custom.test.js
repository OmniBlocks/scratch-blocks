/**
 * @fileoverview Unit tests for custom.js
 * Tests for Blockly customInput block definition
 */
'use strict';

describe('Blockly.Blocks.customInput', function() {
  
  beforeEach(function() {
    // Ensure Blockly namespace exists
    if (typeof Blockly === 'undefined') {
      window.Blockly = {
        Blocks: {},
        OUTPUT_SHAPE_SQUARE: 1,
        Colours: {}
      };
    }
    
    if (!Blockly.Blocks) {
      Blockly.Blocks = {};
    }
    
    // Mock the constants if not available
    if (!Blockly.OUTPUT_SHAPE_SQUARE) {
      Blockly.OUTPUT_SHAPE_SQUARE = 1;
    }
  });
  
  describe('Block Definition', function() {
    it('should define customInput block', function() {
      expect(Blockly.Blocks['customInput']).toBeDefined();
    });
    
    it('should have an init function', function() {
      expect(typeof Blockly.Blocks['customInput'].init).toBe('function');
    });
    
    it('should be an object with init method', function() {
      const block = Blockly.Blocks['customInput'];
      expect(block).toBeInstanceOf(Object);
      expect(block.init).toBeInstanceOf(Function);
    });
  });
  
  describe('Block Initialization', function() {
    let mockBlock;
    
    beforeEach(function() {
      mockBlock = {
        jsonInit: jasmine.createSpy('jsonInit'),
        setOutput: jasmine.createSpy('setOutput'),
        setColour: jasmine.createSpy('setColour'),
        appendDummyInput: jasmine.createSpy('appendDummyInput').and.returnValue({
          appendField: jasmine.createSpy('appendField')
        })
      };
    });
    
    it('should call jsonInit when initialized', function() {
      Blockly.Blocks['customInput'].init.call(mockBlock);
      expect(mockBlock.jsonInit).toHaveBeenCalled();
    });
    
    it('should initialize with correct message0 property', function() {
      Blockly.Blocks['customInput'].init.call(mockBlock);
      const config = mockBlock.jsonInit.calls.argsFor(0)[0];
      expect(config.message0).toBe('%1');
    });
    
    it('should have args0 with field_customInput type', function() {
      Blockly.Blocks['customInput'].init.call(mockBlock);
      const config = mockBlock.jsonInit.calls.argsFor(0)[0];
      expect(config.args0).toBeDefined();
      expect(config.args0.length).toBe(1);
      expect(config.args0[0].type).toBe('field_customInput');
    });
    
    it('should have args0 with CUSTOM field name', function() {
      Blockly.Blocks['customInput'].init.call(mockBlock);
      const config = mockBlock.jsonInit.calls.argsFor(0)[0];
      expect(config.args0[0].name).toBe('CUSTOM');
    });
    
    it('should set outputShape to SQUARE', function() {
      Blockly.Blocks['customInput'].init.call(mockBlock);
      const config = mockBlock.jsonInit.calls.argsFor(0)[0];
      expect(config.outputShape).toBe(Blockly.OUTPUT_SHAPE_SQUARE);
    });
    
    it('should set output type to String', function() {
      Blockly.Blocks['customInput'].init.call(mockBlock);
      const config = mockBlock.jsonInit.calls.argsFor(0)[0];
      expect(config.output).toBe('String');
    });
    
    it('should include colours_pen extension', function() {
      Blockly.Blocks['customInput'].init.call(mockBlock);
      const config = mockBlock.jsonInit.calls.argsFor(0)[0];
      expect(config.extensions).toBeDefined();
      expect(config.extensions).toContain('colours_pen');
    });
    
    it('should only have colours_pen extension', function() {
      Blockly.Blocks['customInput'].init.call(mockBlock);
      const config = mockBlock.jsonInit.calls.argsFor(0)[0];
      expect(config.extensions.length).toBe(1);
    });
  });
  
  describe('Block Configuration Structure', function() {
    let capturedConfig;
    let mockBlock;
    
    beforeEach(function() {
      mockBlock = {
        jsonInit: function(config) {
          capturedConfig = config;
        }
      };
      Blockly.Blocks['customInput'].init.call(mockBlock);
    });
    
    it('should have all required properties', function() {
      expect(capturedConfig).toBeDefined();
      expect(capturedConfig.message0).toBeDefined();
      expect(capturedConfig.args0).toBeDefined();
      expect(capturedConfig.outputShape).toBeDefined();
      expect(capturedConfig.output).toBeDefined();
      expect(capturedConfig.extensions).toBeDefined();
    });
    
    it('should not have unexpected properties', function() {
      const expectedKeys = ['message0', 'args0', 'outputShape', 'output', 'extensions'];
      const actualKeys = Object.keys(capturedConfig);
      
      actualKeys.forEach(function(key) {
        expect(expectedKeys).toContain(key);
      });
    });
    
    it('should have args0 as an array', function() {
      expect(Array.isArray(capturedConfig.args0)).toBe(true);
    });
    
    it('should have extensions as an array', function() {
      expect(Array.isArray(capturedConfig.extensions)).toBe(true);
    });
    
    it('should have args0 field with type and name properties', function() {
      const field = capturedConfig.args0[0];
      expect(field.type).toBeDefined();
      expect(field.name).toBeDefined();
    });
  });
  
  describe('Block Behavior', function() {
    it('should create independent block instances', function() {
      const mockBlock1 = { jsonInit: jasmine.createSpy('jsonInit1') };
      const mockBlock2 = { jsonInit: jasmine.createSpy('jsonInit2') };
      
      Blockly.Blocks['customInput'].init.call(mockBlock1);
      Blockly.Blocks['customInput'].init.call(mockBlock2);
      
      expect(mockBlock1.jsonInit).toHaveBeenCalled();
      expect(mockBlock2.jsonInit).toHaveBeenCalled();
    });
    
    it('should initialize multiple times without errors', function() {
      const mockBlock = { jsonInit: jasmine.createSpy('jsonInit') };
      
      expect(function() {
        Blockly.Blocks['customInput'].init.call(mockBlock);
        Blockly.Blocks['customInput'].init.call(mockBlock);
        Blockly.Blocks['customInput'].init.call(mockBlock);
      }).not.toThrow();
      
      expect(mockBlock.jsonInit).toHaveBeenCalledTimes(3);
    });
  });
  
  describe('Output Configuration', function() {
    let mockBlock;
    let config;
    
    beforeEach(function() {
      mockBlock = {
        jsonInit: function(cfg) {
          config = cfg;
        }
      };
      Blockly.Blocks['customInput'].init.call(mockBlock);
    });
    
    it('should configure block as an output block (not statement)', function() {
      expect(config.output).toBeDefined();
      expect(config.previousStatement).toBeUndefined();
      expect(config.nextStatement).toBeUndefined();
    });
    
    it('should specify String as output type', function() {
      expect(config.output).toBe('String');
    });
    
    it('should use square output shape', function() {
      expect(config.outputShape).toBe(Blockly.OUTPUT_SHAPE_SQUARE);
    });
  });
  
  describe('Field Configuration', function() {
    let mockBlock;
    let fieldConfig;
    
    beforeEach(function() {
      mockBlock = {
        jsonInit: function(config) {
          fieldConfig = config.args0[0];
        }
      };
      Blockly.Blocks['customInput'].init.call(mockBlock);
    });
    
    it('should use field_customInput field type', function() {
      expect(fieldConfig.type).toBe('field_customInput');
    });
    
    it('should name the field CUSTOM', function() {
      expect(fieldConfig.name).toBe('CUSTOM');
    });
    
    it('should only have type and name properties in field config', function() {
      const keys = Object.keys(fieldConfig);
      expect(keys.length).toBe(2);
      expect(keys).toContain('type');
      expect(keys).toContain('name');
    });
  });
  
  describe('Integration with Blockly System', function() {
    it('should be accessible via Blockly.Blocks namespace', function() {
      expect(Blockly.Blocks['customInput']).toBeDefined();
    });
    
    it('should have the correct block type key', function() {
      const blockType = 'customInput';
      expect(Blockly.Blocks[blockType]).toBeDefined();
    });
    
    it('should match expected Blockly block structure', function() {
      const block = Blockly.Blocks['customInput'];
      
      // All Blockly blocks should have an init function
      expect(block.init).toBeDefined();
      expect(typeof block.init).toBe('function');
    });
  });
  
  describe('Extension Configuration', function() {
    let mockBlock;
    let config;
    
    beforeEach(function() {
      mockBlock = {
        jsonInit: function(cfg) {
          config = cfg;
        }
      };
      Blockly.Blocks['customInput'].init.call(mockBlock);
    });
    
    it('should apply colours_pen extension for styling', function() {
      expect(config.extensions).toContain('colours_pen');
    });
    
    it('should not apply other common extensions', function() {
      const commonExtensions = [
        'colours_looks',
        'colours_motion',
        'colours_sound',
        'colours_control',
        'colours_sensing',
        'colours_operators',
        'colours_data'
      ];
      
      commonExtensions.forEach(function(ext) {
        if (ext !== 'colours_pen') {
          expect(config.extensions).not.toContain(ext);
        }
      });
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle initialization with undefined context', function() {
      // This tests what happens if init is called without proper context
      const mockBlock = {
        jsonInit: jasmine.createSpy('jsonInit')
      };
      
      expect(function() {
        Blockly.Blocks['customInput'].init.call(mockBlock);
      }).not.toThrow();
    });
    
    it('should handle missing Blockly.OUTPUT_SHAPE_SQUARE gracefully', function() {
      const originalShape = Blockly.OUTPUT_SHAPE_SQUARE;
      Blockly.OUTPUT_SHAPE_SQUARE = undefined;
      
      const mockBlock = {
        jsonInit: function(config) {
          // Should still work, just with undefined shape
          expect(config.outputShape).toBeUndefined();
        }
      };
      
      Blockly.Blocks['customInput'].init.call(mockBlock);
      
      // Restore
      Blockly.OUTPUT_SHAPE_SQUARE = originalShape;
    });
    
    it('should create valid JSON configuration', function() {
      const mockBlock = {
        jsonInit: function(config) {
          // Should be able to stringify without errors
          expect(function() {
            JSON.stringify(config);
          }).not.toThrow();
        }
      };
      
      Blockly.Blocks['customInput'].init.call(mockBlock);
    });
  });
  
  describe('Message Format', function() {
    let mockBlock;
    let config;
    
    beforeEach(function() {
      mockBlock = {
        jsonInit: function(cfg) {
          config = cfg;
        }
      };
      Blockly.Blocks['customInput'].init.call(mockBlock);
    });
    
    it('should use %1 placeholder for single field', function() {
      expect(config.message0).toBe('%1');
    });
    
    it('should have exactly one argument corresponding to %1', function() {
      expect(config.args0.length).toBe(1);
    });
    
    it('should not have message1 or additional messages', function() {
      expect(config.message1).toBeUndefined();
      expect(config.message2).toBeUndefined();
    });
    
    it('should not have args1 or additional argument arrays', function() {
      expect(config.args1).toBeUndefined();
      expect(config.args2).toBeUndefined();
    });
  });
  
  describe('Block Type Validation', function() {
    it('should return String type for type checking', function() {
      const mockBlock = {
        jsonInit: function(config) {
          expect(config.output).toBe('String');
        }
      };
      
      Blockly.Blocks['customInput'].init.call(mockBlock);
    });
    
    it('should not accept any specific input types', function() {
      const mockBlock = {
        jsonInit: function(config) {
          expect(config.inputsInline).toBeUndefined();
          expect(config.previousStatement).toBeUndefined();
          expect(config.nextStatement).toBeUndefined();
        }
      };
      
      Blockly.Blocks['customInput'].init.call(mockBlock);
    });
  });
});