function BXAuthMainForm(params)
{
	this.nodes = {
		form: null
	};

	this.dataAttributes = {
		nodes: {
			form: 'data-bx-auth-main-form',
			field: 'data-bx-auth-main-field',
			input: 'data-bx-auth-main-input'
		}
	};

	this.dataClasses = {
		nodes: {
			input: {
				notEmpty: 'bx-ui-field__input_filled'
			}
		}
	};

	this.nodes.form = params.nodes.form || null;

	this.init();
}

BXAuthMainForm.prototype.getFieldInputs = function() {
	let _this = this,
		params = { attribute: {} };

	params['attribute'][_this.dataAttributes.nodes.input] = '';

	return BX.findChild(_this.nodes.form, params, true, true);
};

BXAuthMainForm.prototype.init = function() {
	let _this = this;

	if (BX.type.isElementNode(_this.nodes.form))
	{
		let field = _this.getFieldInputs(),
				isFocused = false;

		for (let i = 0; i < field.length; i++)
		{
			if (!isFocused)
			{
				if (BX.type.isString(field[i].value))
				{
					if (!BX.type.isNotEmptyString(field[i].value))
					{
						field[i].focus();
						isFocused = true;
					}
				}
			}

			BX.bind(field[i], 'bxchange', function() {
				let nodeClass = _this.dataClasses.nodes.input.notEmpty;

				switch (true)
				{
					case BX.type.isNotEmptyString(this.value):
						BX.addClass(this, nodeClass);
						break;

					default:
						BX.removeClass(this, nodeClass);
						break;
				}
			});
		}
	}
};

BX.ready(function() {
	let form = document.querySelectorAll('[data-bx-auth-main-form]');

	for (let i = 0; i < form.length; i++)
	{
		(new BXAuthMainForm({
			nodes: {
				form: form[i]
			}
		}));
	}
});