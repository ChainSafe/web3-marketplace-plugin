
export class MarketplaceApiErrors extends Error {
    private response;
	constructor(message: string, response: string) {
		super(message);
		this.response = response;
	}
	public toJSON() {
		return { response: this.response, message: this.message };
	}
}

export class UnknownAccountError extends Error {
    constructor(message: string) {
        super(message);
    }
    public toJSON() {
        return { message: this.message };
    }
}